const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const pass = await bcrypt.hash(password, 10);
  return pass;
}

async function comparePassword(password, hash) {
  const isTheSame = await bcrypt.compare(password, hash);
  return isTheSame;
}

module.exports = { hashPassword, comparePassword };
