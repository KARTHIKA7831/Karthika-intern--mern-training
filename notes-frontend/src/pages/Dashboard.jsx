import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/axios"
import { toast } from "react-toastify"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

const noteSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  body: z.string().trim().min(1, "Body is required"),
});

function Dashboard() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });
useEffect(() => {
  console.log("Context login status:", isLoggedIn);
}, [isLoggedIn]);
const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  
  const [editingId, setEditingId] = useState(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
const [totalPages, setTotalPages] = useState(1)
const [favorite, setFavorite] = useState("all")
const [selectedFile, setSelectedFile] = useState(null)
const [selectedNoteId, setSelectedNoteId] = useState(null)

const handleImageUpload = async () => {
  if (!selectedFile || !selectedNoteId) {
    alert("Please select an image for a note");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile);

  try {
    const response = await api.post(
      `/notes/${selectedNoteId}/image`,
      formData
    );

    console.log("Upload response:", response.data);

    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === selectedNoteId
          ? response.data.note
          : note
      )
    );

    setSelectedFile(null);
    setSelectedNoteId(null);

    alert("Image uploaded successfully!");
  } catch (error) {
    console.log(error);
    alert("Image upload failed");
  }
};

  useEffect(() => {
    
    const timer = setTimeout(() => {
    
    const token = localStorage.getItem("token")

    console.log("TOKEN:", token)
    console.log("API CALL:", {
    page,
    limit: 10,
    search
  })

    api.get("/notes", {
  params: {
    page,
    limit: 10,
    search,
    ...(favorite !== "all" && { favorite })
  }
})
      .then(response => {
        console.log("STATUS:", response.status)
        console.log("NOTES RESPONSE:", response.data)
        console.log("TOTAL PAGES:", response.data.metadata.totalPages)

        setNotes(response.data.notes)
        setTotalPages(response.data.metadata.totalPages)
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setError("Failed to load notes. Please try again.")
        setLoading(false)
      })
      }, 500)

  return () => clearTimeout(timer)
  }, [page, search, favorite])

  
const handleSubmit = (data) => {
  const { title, body } = data;

  if (editingId) {
    api.put(`/notes/${editingId}`, {
      title: title,
      body: body
    })
      .then(response => {
        const data = response.data;

        setNotes(prevNotes =>
          prevNotes.map(note =>
            note._id === data._id ? data : note
          )
        );

        reset();
        setEditingId(null);
      })
      .catch(error => {
        console.log(error);
        toast.error(
          error.response?.data?.error || "Something went wrong"
        );
      });

    return;
  }

  // Create a new note
  api.post("/notes", {
    title: title,
    body: body
  })
    .then(response => {
      const data = response.data;

      // If no image is selected, add the note directly
      if (!selectedFile) {
        setNotes(prevNotes => [...prevNotes, data]);
        reset()
        toast.success("Note created successfully!");
        return;
      }

      // Upload the selected image
      const formData = new FormData();
      formData.append("image", selectedFile);

      return api.post(
        `/notes/${data._id}/image`,
        formData
      )
        .then(imageResponse => {
          const updatedNote = imageResponse.data.note;

          setNotes(prevNotes => [...prevNotes, updatedNote]);

          reset()
          setSelectedFile(null);
          setSelectedNoteId(null);

          toast.success("Note created successfully!");
        });
    })
    .catch(error => {
      console.log(error);
      toast.error(
        error.response?.data?.error || "Something went wrong"
      );
    });
};

  const handleLogout = () => {
    console.log("LOGOUT BUTTON CLICKED")
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    console.log("Logout status updated");
    window.location.href = "/login"
  }

  const handleDelete = (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this note?"
  )

  if (!confirmed) return

  api.delete(`/notes/${id}`)
    .then(() => {
     setNotes(notes.filter(note => note._id !== id))
      toast.success("Note deleted successfully!")
    })
    .catch(error => {
      console.log(error)

      toast.error(
        error.response?.data?.error ||
        "Failed to delete note. Please try again."
      )
    })
}
  const handleFavorite = (note) => {
  api.patch(`/notes/${note._id}/favorite`, {
    isFavorite: !note.isFavorite
  })
    .then(response => {
      const updatedNote = response.data;

      setNotes(prevNotes =>
        prevNotes.map(item =>
          item._id === updatedNote._id
            ? updatedNote
            : item
        )
      );

      toast.success("Favorite updated");
    })
    .catch(error => {
      console.log(error);
      toast.error("Failed to update favorite");
    });
};

  return (
    <div>
      <h1>My Notes</h1>
      
      <input
  type="text"
  placeholder="Search notes..."
  value={search}
  onChange={(e) => {
    setLoading(true)
  setError("")
    setSearch(e.target.value)
    setPage(1)
  }}
  />
  <select
  value={favorite}
  onChange={(e) => {
    setFavorite(e.target.value)
    setPage(1)
  }}
>
  <option value="all">All Notes</option>
  <option value="true">Favorites</option>
  <option value="false">Not Favorites</option>
</select>

      <form onSubmit={handleFormSubmit(handleSubmit)}>
  <input
    type="text"
    placeholder="Title"
    {...register("title")}
  />

  {errors.title && (
    <p role="alert">{errors.title.message}</p>
  )}

  <textarea
    placeholder="Body"
    {...register("body")}
  />

  {errors.body && (
    <p role="alert">{errors.body.message}</p>
  )}

        <input
  type="file"
  accept="image/*"
  onChange={(e) => setSelectedFile(e.target.files[0])}
/>

        <button type="submit">
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      

      {loading ? (
  <p>Loading...</p>
) : error ? (
  <p role="alert">{error}</p>
) : notes.length === 0 ? (
  <p>
    {search.trim()
      ? "No notes match your search."
      : favorite === "true"
      ? "No favorite notes found."
      : favorite === "false"
      ? "No non-favorite notes found."
      : "No notes yet. Create your first note!"}
  </p>
) : (
  notes.map(note => (
    <div key={note._id}>
      <h2>{note.title}</h2>
      <p>{note.body}</p>
      {note.imageUrl && (
  <img
    src={`http://localhost:3000${note.imageUrl}`}
    alt={note.title}
    width="200"
  />
)}
      <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    setSelectedFile(e.target.files[0])
    setSelectedNoteId(note._id)
  }}
/>{selectedNoteId === note._id && selectedFile && (
  <div>
    <p>Image Preview:</p>

    <img
      src={URL.createObjectURL(selectedFile)}
      alt="Selected preview"
      width="200"
    />

    <button onClick={handleImageUpload}>
      Upload Image
    </button>
  </div>
)}

      <button onClick={() => handleFavorite(note)}>
        {note.isFavorite ? "⭐ Favorited" : "☆ Add Favorite"}
      </button>

      <button
        onClick={() => {
          setEditingId(note._id);
         setValue("title", note.title);
          setValue("body", note.body);
          {note.imageUrl && (
  <img
    src={`http://localhost:3000${note.imageUrl}`}
    alt={note.title}
    width="200"
  />
)}
        }}
      >
        Edit
      </button>
      
<button onClick={() => handleDelete(note._id)}>
        Delete
      </button>
    </div>
  ))
)}
<div>
  <button onClick={() => setPage(page - 1)}
    disabled={page === 1}>
    Previous
  </button>

  <span> Page {page} </span>

  <button
  onClick={() => setPage(page + 1)}
  disabled={page === totalPages}
>
  Next
</button>
</div>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default Dashboard