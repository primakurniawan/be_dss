const alternativeService = require("../services/alternativeService");

exports.getAllAlternatives = async function (req, res, next) {
  try {
    const alternatives = await alternativeService.getMultiple();

    res.status(200).json({
      status: "success",
      data: alternatives,
    });
  } catch (err) {
    console.error(`Error while getting alternatives `, err.message);
    next(err);
  }
};

exports.getRankAlternative = async function (req, res, next) {
  try {
    const { parameters_id } = req.query;
    const rankAlternative = await alternativeService.getRankAlternative(JSON.parse(parameters_id));
    res.status(200).json({
      status: "success",
      data: rankAlternative,
    });
  } catch (err) {
    console.error(`Error while getting rank alternative `, err.message);
    next(err);
  }
};

exports.createAlternative = async function (req, res, next) {
  try {
    const { name, parameters_id } = req.body;
    const message = await alternativeService.create(name, parameters_id);
    res.status(201).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while creating alternative`, err.message);
    next(err);
  }
};

exports.updateAlternative = async function (req, res, next) {
  try {
    const { id } = req.params;
    const { name, parameters_id } = req.body;
    const message = await alternativeService.update(id, name, parameters_id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while updating aspect`, err.message);
    next(err);
  }
};

exports.deleteAlternative = async function (req, res, next) {
  try {
    const { id } = req.params;
    const message = await alternativeService.remove(id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while deleting aspect`, err.message);
    next(err);
  }
};
