import { useState, useEffect } from "react"

function Dashboard() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [editingId, setEditingId] = useState(null)

 useEffect(() => {
  const token = localStorage.getItem("token")

  console.log("TOKEN:", token)

  fetch("http://localhost:3000/api/notes", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      console.log("STATUS:", response.status)
      return response.json()
    })
    .then(data => {
      console.log("NOTES RESPONSE:", data)
      setNotes(data)
      setLoading(false)
    })
}, [])

  const handleSubmit = (e) => {
    e.preventDefault()
if (!title.trim() || !body.trim()) {
  alert("Please enter both title and body")
  return
}

    if (editingId) {
      fetch(`http://localhost:3000/api/notes/${editingId}`, {
        method: "PUT",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
},
        body: JSON.stringify({
          title: title,
          body: body
        })
      })
        .then(response => response.json())
        .then(data => {
          setNotes(
            notes.map(note =>
              note._id === data._id ? data : note
            )
          )

          setTitle("")
          setBody("")
          setEditingId(null)
        })

      return
    }

    fetch("http://localhost:3000/api/notes", {
      method: "POST",
      headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
      body: JSON.stringify({
        title: title,
        body: body
      })
    })
      .then(response => response.json())
      .then(data => {
        setNotes([...notes, data])
        setTitle("")
        setBody("")
      })
  }
  const handleLogout = () => {
  localStorage.removeItem("token")
  window.location.href = "/login"
}

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    )

    if (!confirmed) return

    fetch(`http://localhost:3000/api/notes/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})
      .then(() => {
        setNotes(notes.filter(note => note._id !== id))
      })
  }

  return (
    <div>
      <h1>My Notes</h1>
     

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {loading && <p>Loading...</p>}

      {notes.map(note => (
        <div key={note._id}>
          <h2>{note.title}</h2>
          <p>{note.body}</p>

          <button
            onClick={() => {
              setEditingId(note._id)
              setTitle(note.title)
              setBody(note.body)
            }}
          >
            Edit
          </button>

          <button onClick={() => handleDelete(note._id)}>
            Delete
          </button>
        </div>
      ))}
       <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard