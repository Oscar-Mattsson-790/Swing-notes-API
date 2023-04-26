const { Router } = require("express");
const router = new Router();
const jwt = require("jsonwebtoken");
const authToken = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const Note = require("../model/note");
const { comparePassword } = require("../utils/utils");
const { createUser, findUserByUsername } = require("../model/user");

const notesPath = path.join(__dirname, "../utils/notes.json");

router.get("/notes", (request, response) => {
  Note.findNotes()
    .then(function (notes) {
      response.status(200).json(notes);
    })
    .catch(function (err) {
      response.status(500).json({ error: "Internal server error" });
    });
});

router.post("/notes", authToken, async (request, response) => {
  try {
    const note = {
      ...request.body,
      owner: request.user.uuid,
    };
    const createdNote = await Note.createNote(note);
    response.status(200).json(createdNote);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.put("/notes/:id", authToken, async (request, response) => {
  const noteId = request.params.id;
  const updatedNote = request.body;

  Note.findNoteById(noteId)
    .then(function (note) {
      console.log("aoeu", note);
      if (!note) {
        return response.status(404).json({ error: "Note not found" });
      }

      if (note.owner !== request.user.uuid) {
        return response
          .status(403)
          .json({ error: "Not authorized to update the note" });
      }

      Note.updateNoteById(noteId, updatedNote)
        .then(function (res) {
          response.status(200).json(res);
        })
        .catch(function (err) {
          console.error(err);
          response.status(500).json({ error: "Internal server error" });
        });
    })
    .catch(function (err) {
      console.error(err);
      response.status(500).json({ error: "Internal server error" });
    });
});

router.delete("/notes/:id", authToken, async (request, response) => {
  try {
    const noteId = request.params.id;
    await Note.deleteNoteById(noteId, request.user.uuid);
    response.sendStatus(200);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.post("/user/signup", async (request, response) => {
  try {
    const createdUser = await createUser(request.body);
    response.status(200).json(createdUser);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.post("/user/login", async (request, response) => {
  const { username, password } = request.body;
  console.log(username, password);
  try {
    const user = await findUserByUsername(username);
    console.log(username, password, "Hej");
    if (!user) {
      response.status(404).json({ error: "User not found" });
      return;
    }
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      response.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.uuid },
      process.env.ACCESS_TOKEN_SECRET
    );
    response.cookie("token", token, { httpOnly: true });
    response
      .status(200)
      .json({ message: "Logged in successfully!", token: token });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
