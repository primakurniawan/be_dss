const express = require("express");
const router = express.Router();
const parameterController = require("../controllers/parameterController");

router.route("/").get(parameterController.getAllParameters).post(parameterController.createParameter);

router.route("/detail").get(parameterController.getAllParametersDetail);

router.route("/:id").patch(parameterController.updateParameter).delete(parameterController.deleteParameter);

module.exports = router;
