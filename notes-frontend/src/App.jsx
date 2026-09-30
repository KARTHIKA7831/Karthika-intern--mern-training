import { useState, useEffect } from "react"

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3000/api/notes")
      .then(response => response.json())
      .then(data => {
        setNotes(data)
        setLoading(false)
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      fetch(`http://localhost:3000/api/notes/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
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
        "Content-Type": "application/json"
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

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    )

    if (!confirmed) return

    fetch(`http://localhost:3000/api/notes/${id}`, {
      method: "DELETE"
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
    </div>
  )
}

export default App