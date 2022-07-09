const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const categoryRouter = require("./routes/categoryRoute");
const aspectRouter = require("./routes/aspectRoute");
const criteriaRouter = require("./routes/criteriaRoute");
const parameterRouter = require("./routes/parameterRoute");
const alternativeRouter = require("./routes/alternativeRoute");
const activityRouter = require("./routes/activityRoute");
const storeRouter = require("./routes/storeRoute");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use("/categories", categoryRouter);
app.use("/aspects", aspectRouter);
app.use("/criteria", criteriaRouter);
app.use("/parameters", parameterRouter);
app.use("/alternatives", alternativeRouter);
app.use("/activities", activityRouter);
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
