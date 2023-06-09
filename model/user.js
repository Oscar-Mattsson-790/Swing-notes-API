const nedb = require("nedb-promises");
const database = new nedb({ filename: "accounts.db", autoload: true });
const uuid = require("uuid-random");

const { hashPassword, comparePassword } = require("../utils/utils");

async function createUser(credentials) {
  const pass = await hashPassword(credentials.password);

  return database.insert({
    uuid: uuid(),
    username: credentials.username,
    email: credentials.email,
    password: pass,
  });
}

async function findUserByUsername(username) {
  const user = await database.findOne({ username: username });

  if (!user) {
    return null;
  }

  return user;
}

function findUserById(id) {
  const user = database.findOne({ uuid: id });

  if (!user) {
    return null;
  }
  return user;
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  comparePassword,
};
