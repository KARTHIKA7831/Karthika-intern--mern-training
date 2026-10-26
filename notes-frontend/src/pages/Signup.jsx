import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().check(z.email({ message: "Enter a valid email address" })),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

function Signup() {
    const navigate = useNavigate()
    const {
  register,
  handleSubmit: handleFormSubmit,
  formState: { errors }
} = useForm({
  resolver: zodResolver(signupSchema)
})

  
const handleSubmit = async (formData) => {
 const response = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })

  const data = await response.json()

  console.log(data)

  if (!response.ok) {
    alert(data.error || "Signup failed")
    return
  }

  alert("Signup successful!")
  navigate("/login")
  
}

  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={handleFormSubmit(handleSubmit)}>
        <div>
          <label>Name</label>
          <input
  type="text"
  placeholder="Enter name"
  {...register("name")}
/>
{errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
  type="email"
  placeholder="Enter email"
  {...register("email")}
/>
{errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          
<input
  type="password"
  placeholder="Enter password"
  {...register("password")}
/>
{errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Signup</button>
      </form>
    </div>
  )
}

export default Signup