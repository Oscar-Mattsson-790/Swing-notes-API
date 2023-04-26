require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const crypto = require("crypto");

const secret =
  process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");
process.env.ACCESS_TOKEN_SECRET = secret;

async function authToken(request, response, next) {
  try {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      console.log("Access token is missing or invalid");
      return response
        .status(401)
        .json({ message: "Access token is missing or invalid" });
    }

    const token = request.headers.authorization.replace("Bearer ", "");

    if (!token) {
      console.log("Access token is missing");
      return response.status(401).json({ message: "Access token is missing" });
    }

    const payload = await jwt.verify(token, secret);

    const user = await User.findUserById(payload.userId);

    if (!user) {
      console.log("User associated with the token not found");
      return response
        .status(401)
        .json({ message: "User associated with the token not found" });
    }

    request.user = user;
    next();
  } catch (err) {
    console.error(err);
    return response
      .status(401)
      .json({ message: "Invalid access token or secret" });
  }
}

module.exports = authToken;
