const nedb = require("nedb-promises");
const database = new nedb({ filename: "notes.db", autoload: true });

async function createNote(note) {
  console.log("create note data:::", note);
  return await database.insert({
    id: note.id,
    title: note.title,
    text: note.text,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    owner: note.owner,
  });
}

function findNotes() {
  return database.find({});
}

function findNoteById(id) {
  return database.findOne({ _id: id });
}

async function updateNoteById(id, note) {
  await database.update(
    { _id: id },
    { $set: { ...note, modifiedAt: new Date().toISOString() } }
  );
  return note;
}

async function deleteNoteById(id, userId) {
  const note = await findNoteById(id);

  if (!note) {
    throw new Error("Note not found");
  }
  if (note.owner !== userId) {
    throw new Error("Not authorized to delete the note");
  }

  return await database.remove({ _id: id });
}

module.exports = {
  createNote,
  findNotes,
  findNoteById,
  updateNoteById,
  deleteNoteById,
};
