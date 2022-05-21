const express = require("express");
const router = express.Router();
const parameter = require("../services/parameter.js");

/* GET parameter. */
router.get("/", async function (req, res, next) {
  try {
    res.json(await parameter.getMultiple(req.query));
  } catch (err) {
    console.error(`Error while getting parameter `, err.message);
    next(err);
  }
});

router.get("/detail", async function (req, res, next) {
  try {
    res.json(await parameter.getParametersDetail());
  } catch (err) {
    console.error(`Error while getting parameter `, err.message);
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    res.json(await parameter.create(req.body));
  } catch (err) {
    console.error(`Error while creating aspect`, err.message);
    next(err);
  }
});

/* PUT aspect */
router.patch("/:id", async function (req, res, next) {
  try {
    res.json(await parameter.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating aspect`, err.message);
    next(err);
  }
});

/* DELETE aspect */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await parameter.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting aspect`, err.message);
    next(err);
  }
});
module.exports = router;
