const db = require("./db");
const { formatSnakeCase, emptyOrRows } = require("../helper");
const config = require("../config");

async function getMultiple() {
  const result = await db.query(`SELECT * FROM alternatives`);
  const data = emptyOrRows(result);

  return {
    data,
  };
}

async function create(body) {
  const result = await db.query(`INSERT INTO alternatives(name) VALUES ('${body.name}')`);

  let message = "Error in creating alternative";

  if (result.affectedRows) {
    message = "alternative created successfully";
  }

  return { message };
}

async function update(id, body) {
  const result = await db.query(`UPDATE alternatives SET name='${body.name}' WHERE id=${id}`);

  let message = "Error in updating alternative";

  if (result.affectedRows) {
    message = "alternative updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(`DELETE FROM alternatives WHERE id=${id}`);

  let message = "Error in deleting alternative";

  if (result.affectedRows) {
    message = "alternative deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
