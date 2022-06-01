const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.route("/").get(storeController.getAllStores).post(storeController.createStore);

router.route("/shortest").post(storeController.getShortestPath);

router.route("/:id").patch(storeController.editStore).delete(storeController.deleteStore);

module.exports = router;
