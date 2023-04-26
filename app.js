const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const swaggerUI = require("swagger-ui-express");
const apiDocs = require("./docs/docs.json");

app.use(express.json());
app.use("/api", userRouter);
app.use("/api/docs", swaggerUI.serve);
app.get("/api/docs", swaggerUI.setup(apiDocs));

app.listen(8000, () => {
  console.log("Server started");
});
