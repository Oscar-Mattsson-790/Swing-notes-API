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

const notesPath = path.join(__dirname, "../utils/notes.json");

router.get("/notes", (request, response) => {
  const notesData = fs.readFileSync(notesPath, "utf-8");
  const allNotes = JSON.parse(notesData);

  response.json(allNotes);
});

router.post("/notes", async (request, response) => {
  try {
    const createdUser = await createUser(request.body);
    response.status(201).json(createdUser);
  } catch (error) {
    response.status(500).json({ error: "Failed to create user" });
  }
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
