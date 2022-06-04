const db = require("./db");
const { emptyOrRows } = require("../helper");
const config = require("../config");

exports.getMultiple = async () => {
  const result = await db.query(`SELECT * FROM categories`);

  const data = emptyOrRows(result);

  return data;
};

exports.create = async (name) => {
  const result = await db.query(`INSERT INTO categories(name) VALUES ('${name}')`);

  let message = "Error in creating category";

  if (result.affectedRows) {
    message = "category created successfully";
  }

  return message;
};

exports.update = async (id, name) => {
  const result = await db.query(`UPDATE categories SET name='${name}' WHERE id=${id}`);

  let message = "Error in updating category";

  if (result.affectedRows) {
    message = "category updated successfully";
  }

  return message;
};

exports.remove = async (id) => {
  const result = await db.query(`DELETE FROM categories WHERE id=${id}`);

  let message = "Error in deleting categories";

  if (result.affectedRows) {
    message = "categories deleted successfully";
  }

  return message;
};
