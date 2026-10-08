# Karthika MERN Training

This repository contains my MERN stack training work, including frontend and backend applications.

## Projects

### Notes Frontend

A React and Vite frontend application for managing notes.

### Features

* Create notes
* Edit notes
* Delete notes
* Controlled form inputs
* Form validation
* No page reload during CRUD operations
* User login and signup
* Protected routes
* JWT token storage
* Logout functionality
* Search notes
* Pagination with Previous/Next controls
* Debounced search

### Tech Stack

* React
* Vite
* JavaScript
* Axios
* React Router
* React Toastify

### Hello World API

A simple Node.js and Express backend API.

### API

GET /

Response:

```
{
  "status": "ok"
}
```

### Notes API Endpoints

GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id

### Authentication API

POST /api/auth/signup
POST /api/auth/login

### JWT Authentication

Added JWT-based authentication to protect the Notes API.

Passwords are hashed using bcrypt before being stored in the database. Password hashes are never returned in API responses.

### Authentication Flow

1. User signs up with name, email, and password.
2. Server hashes the password using bcrypt.
3. User information is saved in the database.
4. User logs in with email and password.
5. Server verifies the password using bcrypt.
6. Server generates a JWT containing the user ID.
7. JWT is returned after successful login.
8. Client stores the JWT.
9. Axios automatically sends the JWT with API requests.
10. Auth middleware verifies the JWT.
11. Valid user information is attached to req.user.
12. The request continues to the protected route.

### Protected Routes

GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id

### Related Models

Notes are associated with users using MongoDB ObjectId references.

Each note belongs to the user who created it.

Mongoose populate() is used to retrieve related user information when required.

### Search and Pagination

The Notes API supports pagination and search using query parameters.

Example:

```
/api/notes?page=2&limit=10&search=CSK
```

Pagination uses page, limit, and skip.

Search supports matching text in both the note title and body using MongoDB $regex.

The frontend uses a debounced search box to avoid unnecessary API requests while typing.

### Axios

A shared Axios instance is used for API communication.

Request interceptors automatically attach the JWT to outgoing requests.

Response interceptors handle unauthorized responses and redirect the user to the login page when required.

API errors are displayed using toast messages.

### Testing

No token → 401 Unauthorized
Invalid token → 401 Unauthorized
Valid token → Request allowed
Search → Matching notes displayed
Pagination → Different notes displayed on different pages
Duplicate email → Signup fails cleanly
Password → Never returned in API response

### How to Run Frontend

```
cd notes-frontend
npm install
npm run dev
```

### How to Run Backend

```
cd hello-world-api
npm install
npm run dev
```

## Purpose

This repository is used to track my MERN stack training progress and projects.
