const jwt = require("jsonwebtoken");
const User = require("../model/user");

function authToken(request, response, next) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return response.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return response.sendStatus(403);
    }
    try {
      const user = await User.findOne({ _id: payload.userId });
      if (!user) {
        throw new Error();
      }
      request.user = user;
      next();
    } catch (err) {
      return response.sendStatus(403);
    }
  });
}

module.exports = authToken;
