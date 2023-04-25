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

async function findUserByUsername(username, password) {
  const user = await database.findOne({ username: username });
  if (!user) {
    return null;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return null;
  }

  delete user.password;

  return user;
}

async function findUserById(id) {
  return await database.findOne({ uuid: id });
}

module.exports = { createUser, findUserByUsername, findUserById };
