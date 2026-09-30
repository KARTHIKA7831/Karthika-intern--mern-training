Notes App

A React and Vite frontend application for managing notes through a REST API.

Features

Create a new note

Edit an existing note

Delete a note

Form validation

Controlled form inputs

Update the UI without page reload

Tech Stack

React

Vite

JavaScript

Fetch API

REST API

How to Run

Install dependencies:

npm install


Start the development server:

npm run dev


The frontend connects to the Notes API at:

http://localhost:3000/api/notes

API Endpoints
Method	Endpoint	Purpose
GET	/api/notes	Get all notes
POST	/api/notes	Create a note
PUT	/api/notes/:id	Update a note
DELETE	/api/notes/:id	Delete a note