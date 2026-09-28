import { useState, useEffect } from "react"

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:3000/api/notes")
      .then(response => response.json())
      .then(data => {
        setNotes(data)
        setLoading(false)
        
      })
  }, [])

  return (
    <div>
      <h1>My Notes</h1>
      {loading && <p>Loading...</p>}

      {notes.map(note => (
        <div key={note._id}>
          <h2>{note.title}</h2>
          <p>{note.body}</p>
        </div>
      ))}
    </div>
  )
}

export default App
