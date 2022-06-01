const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple() {
  const rows = await db.query(`SELECT * FROM aspects;`);
  const data = helper.emptyOrRows(rows);

  return data;
}

async function create(name, percentage) {
  const result = await db.query(`INSERT INTO aspects(name, percentage) VALUES ('${name}',${percentage})`);

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
