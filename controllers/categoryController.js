const categoryService = require("../services/categoryService");

exports.getAllCategories = async function (req, res, next) {
  try {
    const categories = await categoryService.getMultiple();

    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (err) {
    console.error(`Error while getting categories `, err.message);
    next(err);
  }
};

exports.createCategory = async function (req, res, next) {
  try {
    const { name } = req.body;
    const message = await categoryService.create(name);
    res.status(201).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while creating category`, err.message);
    next(err);
  }
};

exports.updateCategory = async function (req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const message = await categoryService.update(id, name);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while updating category`, err.message);
    next(err);
  }
};

exports.deleteCategory = async function (req, res, next) {
  try {
    const { id } = req.params;
    const message = await categoryService.remove(id);
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error(`Error while deleting category`, err.message);
    next(err);
  }
};
