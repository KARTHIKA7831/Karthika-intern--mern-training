Day 3 — Full CRUD, Validation & MongoDB
What I learned

Learned what CRUD means: Create, Read, Update, and Delete.

Learned how PUT and DELETE requests work.

Learned why API input validation is important.

Learned how express-validator validates incoming data.

Learned how MongoDB Atlas and Mongoose are used to store data permanently.

Learned how environment variables can be used for sensitive configuration such as the MongoDB connection string.

What I built

Added PUT /api/notes/:id for updating notes.

Added DELETE /api/notes/:id for deleting notes.

Added validation for note titles.

Required the title and set a minimum length of 3 characters.

Connected the Express server to MongoDB using Mongoose and MONGO_URI.

Testing

Tested valid note creation and updates.

Tested invalid titles and confirmed that validation returns a 400 response.

Tested delete functionality.

Confirmed that the server connects successfully to MongoDB.

Status

Day 3 completed.
