const criteriaService = require("../services/criteriaService");

exports.getAllCriteria = async (req, res, next) => {
  try {
    const criteria = await criteriaService.getMultiple();
    res.status(200).json({
      status: "success",
      data: criteria,
    });
  } catch (err) {
    console.error(`Error while getting criteria `, err.message);
    next(err);
  }
};

exports.createCriteria = async (req, res, next) => {
  try {
    const { aspect_id, name, percentage } = req.body;
    const message = await criteriaService.create(aspect_id, name, percentage);
    res.status(201).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while creating criteria`, err.message);
    next(err);
  }
};

exports.updateCriteria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, percentage } = req.body;
    const message = await criteriaService.update(id, name, percentage);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while updating criteria`, err.message);
    next(err);
  }
};

exports.deleteCriteria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await criteriaService.remove(id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while deleting criteria`, err.message);
    next(err);
  }
};
