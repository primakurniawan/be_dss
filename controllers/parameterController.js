const parameterService = require("../services/parameterService.js");

exports.getAllParameters = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    const parameters = await parameterService.getMultiple(category_id);
    res.json({
      status: "success",
      data: parameters,
    });
  } catch (err) {
    console.error(`Error while getting parameter `, err.message);
    next(err);
  }
};

exports.createParameter = async (req, res, next) => {
  try {
    const { criteria_id, name, point } = req.body;
    const message = await parameterService.create(criteria_id, name, point);
    res.status(201).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while creating parameter`, err.message);
    next(err);
  }
};

exports.updateParameter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, point } = req.body;
    const message = await parameterService.update(id, name, point);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while updating parameter`, err.message);
    next(err);
  }
};

exports.deleteParameter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await parameterService.remove(id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while deleting parameter`, err.message);
    next(err);
  }
};

exports.getAllParametersDetail = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    const parameters = await parameterService.getParametersDetail(category_id);
    res.json({
      status: "success",
      data: parameters,
    });
  } catch (err) {
    console.error(`Error while getting parameter `, err.message);
    next(err);
  }
};
