const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
  console.log(password, hashedPassword);
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
