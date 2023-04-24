const { Router } = require("express");
const router = new Router();
const jwt = require("jsonwebtoken");
const authToken = require("../middleware/auth");
const noteModel = require("../model/note");
const fs = require("fs");
const path = require("path");

const notesPath = path.join(__dirname, "/utils/notes.json");

router.get("/notes", (request, response) => {
  const notesData = fs.readFileSync(notesPath, "utf-8");
  const allNotes = JSON.parse(notesData);

  response.json(allNotes);
});

router.post("/notes", (request, response) => {
  const note = request.body;

  // Save the note to the database using your model
  noteModel.create(note, (err, savedNote) => {
    if (err) {
      response.status(500).json({ error: "Failed to save note" });
    } else {
      // Return the saved note in the response
      response.status(201).json(savedNote);
    }
  });
});

router.put("/notes/:id", (request, response) => {
  const noteId = request.params.id;
  const updatedNote = request.body;

  response.json(updatedNote);
});

router.delete("/notes/:id", (request, response) => {
  const noteId = request.params.id;

  response.sendStatus(204);
});

router.post("/user/signup", async (request, response) => {
  try {
    const createdUser = await createUser(request.body);
    response.status(201).json(createdUser);
  } catch (error) {
    response.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/user/login", async (request, response) => {
  const { username, password } = request.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      throw new Error();
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error();
    }

    const token = jwt.sign(
      { userId: user.uuid },
      process.env.ACCESS_TOKEN_SECRET
    );
    response.cookie("token", token, { httpOnly: true });
    response.json({ message: "Logged in successfully!" });
  } catch (error) {
    response.status(401).json({ error: "Invalid username or password" });
  }
});

module.exports = router;
