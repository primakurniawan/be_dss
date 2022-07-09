const activityService = require("../services/activityService");

exports.getAllActivity = async function (req, res, next) {
  try {
    const { category_id } = req.query;
    const activities = await activityService.getMultiple(category_id);

    res.status(200).json({
      status: "success",
      data: activities,
    });
  } catch (err) {
    console.error(`Error while getting activities `, err.message);
    next(err);
  }
};

exports.getRankActivity = async function (req, res, next) {
  try {
    const { category_id, parameters_id } = req.query;
    const rankActivity = await activityService.getRankActivity(category_id, JSON.parse(parameters_id));
    res.status(200).json({
      status: "success",
      data: rankActivity,
    });
  } catch (err) {
    console.error(`Error while getting rank activity `, err.message);
    next(err);
  }
};

exports.createActivity = async function (req, res, next) {
  try {
    const { category_id } = req.query;
    const { name, parameters_id } = req.body;
    const message = await activityService.create(category_id, name, parameters_id);
    res.status(201).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while creating activity`, err.message);
    next(err);
  }
};

exports.updateActivity = async function (req, res, next) {
  try {
    const { id } = req.params;
    const { name, parameters_id } = req.body;
    const message = await activityService.update(id, name, parameters_id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while updating aspect`, err.message);
    next(err);
  }
};

exports.deleteActivity = async function (req, res, next) {
  try {
    const { id } = req.params;
    const message = await activityService.remove(id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while deleting aspect`, err.message);
    next(err);
  }
};
