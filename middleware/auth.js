require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");
process.env.ACCESS_TOKEN_SECRET = secret;

console.log(secret);

async function authToken(request, response, next) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.replace("Bearer ", "");

  try {
    const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ uuid: payload.userId });

    if (!user) {
      throw new Error();
    }

    request.user = user;
    request.token = token;
    request.id = payload.userId;
    next();
  } catch (error) {
    response.json({ success: false, error: "Invalid token" });
  }
}

module.exports = authToken;
