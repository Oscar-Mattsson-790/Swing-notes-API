const { Router } = require("express");
const router = new Router();
const jwt = require("jsonwebtoken");
const authToken = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

const notesFilePath = path.join(__dirname, "/utils/notes.json");

// GET endpoint to retrieve all notes
router.get("/notes", (req, res) => {
  const notesData = fs.readFileSync(notesFilePath, "utf-8");
  const notes = JSON.parse(notesData);

  res.json(notes);
});

// POST endpoint to save a new note
router.post("/notes", (req, res) => {
  const note = req.body;

  res.status(201).json(savedNote);
});

// PUT endpoint to modify an existing note
router.put("/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const updatedNote = req.body;

  res.json(updatedNote);
});

// DELETE endpoint to delete a note
router.delete("/notes/:id", (req, res) => {
  const noteId = req.params.id;

  res.sendStatus(204);
});

// POST endpoint to create a new user account
router.post("/user/signup", (req, res) => {
  const userData = req.body;

  res.status(201).json(createdUser);
});

// POST endpoint to log in to an existing user account
router.post("/user/login", (req, res) => {
  const loginData = req.body;

  res.json({ message: "Logged in successfully!" });
});

// GET endpoint to search for notes by title
router.get("/notes/search", (req, res) => {
  const searchTerm = req.query.title;

  res.json(searchResults);
});

module.exports = router;
