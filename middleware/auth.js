require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const crypto = require("crypto");

const secret =
  process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(64).toString("hex");
process.env.ACCESS_TOKEN_SECRET = secret;

console.log(secret);

async function authToken(request, response, next) {
  try {
    console.log("authToken middleware called");
    console.log("headers:", request.headers);
    const authHeader = request.headers["Authorization"];
    console.log("authHeader:", authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log("token:", token);

    if (!token) {
      console.log("Access token is missing");
      return response.status(401).json({ message: "Access token is missing" });
    }

    const payload = await jwt.verify(token, secret);
    const user = await User.findOne({ uuid: payload.userId });

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
