const nedb = require("nedb-promises");
const database = new nedb({ filename: "notes.db", autoload: true });
const uuid = require("uuid-random");

async function createNote(note) {
  return await database.insert({
    id: uuid(),
    title: note.title,
    text: note.text,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  });
}

async function findNotes() {
  return await database.find({});
}

async function findNoteById(id) {
  return await database.findOne({ id: id });
}

async function updateNoteById(id, note) {
  return await database.update({ id: id }, { $set: note });
}

async function deleteNoteById(id) {
  return await database.remove({ id: id });
}

module.exports = {
  createNote,
  findNotes,
  findNoteById,
  updateNoteById,
  deleteNoteById,
};
