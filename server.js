require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth");
const upload = require("./middleware/upload");
const fs = require("fs");
const path = require("path");


const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
  });

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  body: {
    type: String,
    default: ""
  },
  imageUrl: {
  type: String,
  default: ""
},
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
isFavorite: {
  type: Boolean,
  default: false
},

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model("Note", noteSchema);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello World" });
});


app.post(
  "/api/notes/:id/image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Please upload an image"
        });
      }

      // Find the note belonging to this user
      const note = await Note.findOne({
        _id: req.params.id,
        user: req.user.userId
      });

      if (!note) {
        // Remove newly uploaded file if note doesn't exist
        fs.unlinkSync(req.file.path);

        return res.status(404).json({
          error: "Note not found"
        });
      }

      // Save the old image URL
      const oldImageUrl = note.imageUrl;

      // Update the note with the new image URL
      note.imageUrl = `/uploads/${req.file.filename}`;
      await note.save();

      // Delete the old image after successful update
      if (oldImageUrl) {
        const oldFilename = path.basename(oldImageUrl);
        const oldImagePath = path.join(
          __dirname,
          "uploads",
          oldFilename
        );

        if (
          oldFilename &&
          oldFilename !== req.file.filename &&
          fs.existsSync(oldImagePath)
        ) {
          fs.unlinkSync(oldImagePath);
        }
      }

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: note.imageUrl,
        note
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);
app.get("/api/notes", authMiddleware, async (req, res) => {
  try {
  const {
  page = 1,
  limit = 10,
  search = "",
  favorite
} = req.query;
    const skip = (page - 1) * limit;
    const filter = {
  user: req.user.userId,
  $and: [
    {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } }
      ]
    }
  ]
};

if (favorite === "true") {
  filter.$and.push({ isFavorite: true });
} else if (favorite === "false") {
  filter.$and.push({
    $or: [
      { isFavorite: false },
      { isFavorite: { $exists: false } }
    ]
  });
}
    const total = await Note.countDocuments(filter);

const totalPages = Math.ceil(total / limit);

const notes = await Note.find(filter)
  .skip(skip)
  .limit(Number(limit));

res.json({
  notes,
  metadata: {
    page,
    limit,
    total,
    totalPages
  }
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(
  "/api/auth/signup",

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

    body("email")
  .trim()
  .isEmail()
  .withMessage("Valid email is required")
  .normalizeEmail(),

  body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long"),
  
 async (req, res) => {
  const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({
    errors: errors.array()
  });
}

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash
    });

    res.status(201).json({
      message: "Signup successful"
    });

  }catch (err) {
    res.status(500).json({
      error: "Something went wrong"
    });
   }
  });

  app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
const user = await User.findOne({ email });
if (!user) {
  return res.status(401).json({
    error: "Invalid email or password"
  });
}
const isPasswordCorrect = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isPasswordCorrect) {
  return res.status(401).json({
    error: "Invalid email or password"
  });
}
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

res.status(200).json({
  message: "Login successful",
  token
});

} catch (err) {

    res.status(500).json({
      error: "Something went wrong"
    });

  }
});


app.post(
  "/api/notes",
  authMiddleware,
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const { title, body } = req.body || {};

      const note = await Note.create({
        title,
        body,
        user: req.user.userId
      });

      res.status(201).json(note);

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

app.put(
  "/api/notes/:id",
  authMiddleware,
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const { title, body } = req.body || {};

      const note = await Note.findOneAndUpdate(
        {
    _id: req.params.id,
    user: req.user.userId
  },
        { title, body },
        {
          returnDocument: "after",
          runValidators: true
        }
      );

      if (!note) {
        return res.status(404).json({
          error: "Note not found"
        });
      }

      res.json(note);

    } catch (err) {
      res.status(400).json({
        error: "Invalid note ID"
      });
    }
  }
);


app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!note) {
      return res.status(404).json({
        error: "Note not found"
      });
    }

    // Delete the image file if the note has one
    if (note.imageUrl) {
      const filename = path.basename(note.imageUrl);
      const imagePath = path.join(__dirname, "uploads", filename);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the note from MongoDB
    await Note.findOneAndDelete({
      _id: note._id,
      user: req.user.userId
    });

    res.status(204).send();

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete note"
    });
  }
});

app.patch(
  "/api/notes/:id/favorite",
  authMiddleware,
  async (req, res) => {
    try {
      const { isFavorite } = req.body;

      // Check whether the input is a Boolean
      if (typeof isFavorite !== "boolean") {
        return res.status(400).json({
          error: "isFavorite must be true or false"
        });
      }

      // Update only the logged-in user's note
      const note = await Note.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.userId
        },
        { isFavorite },
        {
          returnDocument: "after" ,
          runValidators: true
        }
      );

      if (!note) {
        return res.status(404).json({
          error: "Note not found"
        });
      }

      res.status(200).json(note);

    } catch (err) {
      if (err.name === "CastError") {
        return res.status(400).json({
          error: "Invalid note ID"
        });
      }

      res.status(500).json({
        error: "Server error"
      });
    }
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
