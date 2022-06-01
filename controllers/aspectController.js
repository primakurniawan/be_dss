const aspectService = require("../services/aspectService.js");

exports.getAspects = async (req, res, next) => {
  try {
    const aspects = await aspectService.getMultiple();
    res.status(200).json({
      status: "success",
      data: aspects,
    });
  } catch (err) {
    console.error(`Error while getting aspects `, err.message);
    next(err);
  }
};

exports.createAspect = async (req, res, next) => {
  try {
    const { name, percentage } = req.body;
    const message = await aspectService.create(name, percentage);
    res.status(201).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while creating aspect`, err.message);
    next(err);
  }
};

exports.updateAspect = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, percentage } = req.body;
    const message = await aspectService.update(id, name, percentage);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while updating aspect`, err.message);
    next(err);
  }
};

exports.deleteAspect = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await aspectService.remove(id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while deleting aspect`, err.message);
    next(err);
  }
};
