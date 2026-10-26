import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext.js"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .check(z.email({ message: "Enter a valid email address" })),

  password: z
    .string()
    .min(1, "Password is required")
})

function Login() {
  const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: ""
  }
})
  const { setIsLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmit = async ({ email, password }) => {
    

    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await response.json()

    console.log(data)

    if (!response.ok) {
      alert(data.error || "Login failed")
      return
    }
    localStorage.setItem("token", data.token)

    setIsLoggedIn(true)

alert("Login successful!")

navigate("/dashboard")
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter email"
          />
          {errors.email && <p role="alert">{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter password"
          />
          {errors.password && (
  <p role="alert">{errors.password.message}</p>
)}
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login