const storeService = require("../services/storeService");

exports.getAllStores = async (req, res, next) => {
  try {
    const stores = await storeService.getMultiple();
    res.status(200).json({
      status: "success",
      data: stores,
    });
  } catch (err) {
    console.error(`Error while getting stores `, err.message);
    next(err);
  }
};

exports.createStore = async (req, res, next) => {
  try {
    const { name, address, contact, lon, lat } = req.body;
    const message = await storeService.create(name, address, contact, lon, lat);
    res.status(201).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while creating store`, err.message);
    next(err);
  }
};

exports.editStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, contact, lon, lat } = req.body;
    const message = await storeService.update(id, name, address, contact, lon, lat);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while updating store`, err.message);
    next(err);
  }
};

exports.deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await storeService.remove(id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while deleting store`, err.message);
    next(err);
  }
};

exports.getShortestPath = async (req, res, next) => {
  try {
    const { current_location, store_id } = req.body;
    const route = await storeService.getShortestPathStore(current_location, store_id);
    res.status(200).json({
      status: "success",
      data: route,
    });
  } catch (err) {
    console.error(`Error while creating store`, err.message);
    next(err);
  }
};
