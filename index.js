const express = require("express");
const app = express();
const port = 3000;

const aspectsRouter = require("./routes/aspects");
const typesRouter = require("./routes/types");
const criteriaRouter = require("./routes/criteria");
const parametersRouter = require("./routes/parameters");
const alternativesRouter = require("./routes/alternatives");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/types", typesRouter);
app.use("/aspects", aspectsRouter);
app.use("/criteria", criteriaRouter);
app.use("/parameters", parametersRouter);
app.use("/alternatives", alternativesRouter);

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
