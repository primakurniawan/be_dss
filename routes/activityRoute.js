const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

router.route("/").get(activityController.getAllActivity).post(activityController.createActivity);

router.route("/rank").get(activityController.getRankActivity);

router.route("/:id").patch(activityController.updateActivity).delete(activityController.deleteActivity);

module.exports = router;
