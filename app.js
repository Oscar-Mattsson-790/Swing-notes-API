const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const userRouter = require("./routes/user");

app.use(express.json());
app.use("/api", userRouter);

app.listen(8000, () => {
  console.log("Server started");
});
