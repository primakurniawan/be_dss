const express = require("express");
const router = express.Router();
const alternativeController = require("../controllers/alternativeController");

router.route("/").get(alternativeController.getAllAlternatives).post(alternativeController.createAlternative);

router.route("/rank").get(alternativeController.getRankAlternative);

router.route("/:id").patch(alternativeController.updateAlternative).delete(alternativeController.deleteAlternative);

module.exports = router;
