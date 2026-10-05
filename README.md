Karthika MERN Training

This repository contains my MERN stack training work, including frontend and backend applications.

Projects Notes Frontend

A React and Vite frontend application for managing notes.

Features:

Create notes

Edit notes

Delete notes

Controlled form inputs

Form validation

No page reload during CRUD operations

Tech Stack

React

Vite

JavaScript

Fetch API

Hello World API

A simple Node.js and Express backend API.

API GET /

Response { "status": "ok" }

Notes API Endpoints GET /api/notes POST /api/notes PUT /api/notes/:id DELETE /api/notes/:id

How to Run Frontend cd notes-frontend npm install npm run dev

Backend cd hello-world-api npm install npm run dev

JWT Authentication

Added JWT-based authentication to protect the Notes API.

Authentication Flow

User logs in with email and password.

Server verifies the password using bcrypt.

Server generates a JWT containing the user ID.

JWT is returned after successful login.

Client sends the JWT in the Authorization header.

Auth middleware verifies the JWT.

Valid user information is attached to req.user.

The request continues to the protected route.

Protected Routes

GET /api/notes

POST /api/notes

PUT /api/notes/:id

DELETE /api/notes/:id

Testing

No token → 401 Unauthorized

Invalid token → 401 Unauthorized

Valid token → 200 OK

Purpose

This repository is used to track my MERN stack training progress and projects.
