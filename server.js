require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const User = require("./models/User");

const app = express();

app.use(express.json());
app.use(cors());


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

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
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
res.status(200).json({
  message: "Login successful"
});
} catch (err) {

    res.status(500).json({
      error: "Something went wrong"
    });

  }
});


app.post(
  "/api/notes",
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
        body
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

      const note = await Note.findByIdAndUpdate(
        req.params.id,
        { title, body },
        {
          new: true,
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

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        error: "Note not found"
      });
    }

    res.status(204).send();

  } catch (err) {
    res.status(400).json({
      error: "Invalid note ID"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
