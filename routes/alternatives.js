const express = require("express");
const router = express.Router();
const alternative = require("../services/alternative");

/* GET criteria. */
router.get("/", async function (req, res, next) {
  try {
    res.json(await alternative.getMultiple());
  } catch (err) {
    console.error(`Error while getting criteria `, err.message);
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    res.json(await alternative.create(req.body));
  } catch (err) {
    console.error(`Error while creating aspect`, err.message);
    next(err);
  }
});

/* PUT aspect */
router.patch("/:id", async function (req, res, next) {
  try {
    res.json(await alternative.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating aspect`, err.message);
    next(err);
  }
});

/* DELETE aspect */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await alternative.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting aspect`, err.message);
    next(err);
  }
});
module.exports = router;
