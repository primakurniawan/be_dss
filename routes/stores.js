const express = require("express");
const router = express.Router();
const stores = require("../services/store.js");

/* GET aspects. */
router.get("/", async function (req, res, next) {
  try {
    res.json(await stores.getMultiple());
  } catch (err) {
    console.error(`Error while getting stores `, err.message);
    next(err);
  }
});

router.post("/shortest", async function (req, res, next) {
  try {
    // , req.body.stores_id
    res.json(await stores.getShortestPathStore(req.body.current_location, req.body.store_id));
  } catch (err) {
    console.error(`Error while creating store`, err.message);
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    res.json(await stores.create(req.body));
  } catch (err) {
    console.error(`Error while creating store`, err.message);
    next(err);
  }
});

/* PUT store */
router.patch("/:id", async function (req, res, next) {
  try {
    res.json(await stores.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating store`, err.message);
    next(err);
  }
});

/* DELETE store */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await stores.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting store`, err.message);
    next(err);
  }
});
module.exports = router;
