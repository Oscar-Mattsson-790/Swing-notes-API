const { Router } = require("express");
const router = new Router();
const jwt = require("jsonwebtoken");
const authToken = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

const {
  createUser,
  findUserByUsername,
  comparePassword,
} = require("../model/user");

const {
  findNoteById,
  updateNoteById,
  deleteNoteById,
} = require("../model/note");

const notesPath = path.join(__dirname, "../utils/notes.json");

router.get("/notes", (request, response) => {
  const data = fs.readFileSync(notesPath, "utf-8");
  const allNotes = JSON.parse(data);

  response.json(allNotes);
});

router.post("/notes", authToken, async (request, response) => {
  try {
    const note = {
      ...request.body,
      owner: request.user.uuid,
    };
    const createdNote = await createNote(note);
    response.status(200).json(createdNote);
  } catch (error) {
    response.status(500).json({ error: "Failed to save note" });
  }
});

router.put("/notes/:id", authToken, async (request, response) => {
  try {
    const noteId = request.params.id;
    const updatedNote = request.body;

    const note = await findNoteById(noteId);
    if (!note) {
      return response.status(404).json({ error: "Note not found" });
    }

    if (note.owner !== request.user.uuid) {
      return response
        .status(403)
        .json({ error: "Not authorized to update the note" });
    }

    const updatedNoteInDb = await updateNoteById(noteId, updatedNote);
    response.json(updatedNoteInDb);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to update the note" });
  }
});

router.delete("/notes/:id", authToken, async (request, response) => {
  try {
    const noteId = request.params.id;
    await deleteNoteById(noteId, request.user.uuid);
    response.sendStatus(204);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to delete the note" });
  }
});

router.post("/user/signup", async (request, response) => {
  try {
    const createdUser = await createUser(request.body);
    response.status(200).json(createdUser);
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
