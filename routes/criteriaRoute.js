const express = require("express");
const router = express.Router();
const criteriaController = require("../controllers/criteriaController");

router.route("/").get(criteriaController.getAllCriteria).post(criteriaController.createCriteria);

router.route("/:id").patch(criteriaController.updateCriteria).delete(criteriaController.deleteCriteria);

module.exports = router;
