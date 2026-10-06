import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Signup() {
    const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!name || !email || !password) {
    alert("Please fill all fields")
    return
  }

  const response = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  })

  const data = await response.json()

  console.log(data)

  if (!response.ok) {
    alert(data.error || "Signup failed")
    return
  }

  alert("Signup successful!")
  navigate("/login")
  setName("")
  setEmail("")
  setPassword("")
}

  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button type="submit">Signup</button>
      </form>
    </div>
  )
}

export default Signup