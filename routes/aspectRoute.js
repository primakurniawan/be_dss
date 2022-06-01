const express = require("express");
const router = express.Router();
const aspectController = require("../controllers/aspectController");

router.route("/").get(aspectController.getAspects).post(aspectController.createAspect);

router.route("/:id").patch(aspectController.updateAspect).delete(aspectController.deleteAspect);

module.exports = router;
