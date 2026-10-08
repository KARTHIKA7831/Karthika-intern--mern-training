import { useState, useEffect } from "react"
import api from "../api/axios"
import { toast } from "react-toastify"

function Dashboard() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [editingId, setEditingId] = useState(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
    const token = localStorage.getItem("token")

    console.log("TOKEN:", token)
    console.log("API CALL:", {
    page,
    limit: 10,
    search
  })

    api.get(`/notes?page=${page}&limit=10&search=${search}`)
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
        setLoading(false)
      })
      }, 500)

  return () => clearTimeout(timer)
  }, [page, search])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim() || !body.trim()) {
      toast.error("Please enter both title and body")
      return
    }

    if (editingId) {
      api.put(`/notes/${editingId}`, {
        title: title,
        body: body
      })
        .then(response => {
          const data = response.data

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

    api.post("/notes", {
      title: title,
      body: body
    })
      .then(response => {
        const data = response.data

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

    api.delete(`/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note._id !== id))
      })
  }

  return (
    <div>
      <h1>My Notes</h1>
    <input
  type="text"
  placeholder="Search notes..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value)
    setPage(1)
  }}
/>
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