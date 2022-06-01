const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const aspectRouter = require("./routes/aspectRoute");
const criteriaRouter = require("./routes/criteriaRouter");
const parameterRouter = require("./routes/parameterRouter");
const alternativeRouter = require("./routes/alternativeRoute");
const storeRouter = require("./routes/storeRouter");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/aspects", aspectRouter);
app.use("/criteria", criteriaRouter);
app.use("/parameters", parameterRouter);
app.use("/alternatives", alternativeRouter);
app.use("/stores", storeRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
