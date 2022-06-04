const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple(category_id) {
  const rows = await db.query(`SELECT * FROM aspects${category_id ? ` WHERE category_id=${category_id}` : ""};`);
  const data = helper.emptyOrRows(rows);

  return data;
}

async function create(category_id, name, percentage) {
  const result = await db.query(`INSERT INTO aspects(category_id, name, percentage) VALUES (${category_id},'${name}',${percentage})`);

  let message = "Error in creating aspect";

  if (result.affectedRows) {
    message = "Aspect created successfully";
  }

  return message;
}

async function update(id, name, percentage) {
  const result = await db.query(`UPDATE aspects SET name='${name}',percentage=${percentage} WHERE id=${id}`);

  let message = "Error in updating aspect";

  if (result.affectedRows) {
    message = "aspect updated successfully";
  }

  return message;
}

async function remove(id) {
  const result = await db.query(`DELETE FROM aspects WHERE id=${id}`);

  let message = "Error in deleting aspect";

  if (result.affectedRows) {
    message = "aspect deleted successfully";
  }

  return message;
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
