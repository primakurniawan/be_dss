const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple() {
  const rows = await db.query(`SELECT * FROM aspects;`);
  const data = helper.emptyOrRows(rows);

  return {
    data,
  };
}

async function create(body) {
  const result = await db.query(`INSERT INTO aspects(name, percentage) VALUES ('${body.name}',${body.percentage})`);

  let message = "Error in creating aspect";

  if (result.affectedRows) {
    message = "Aspect created successfully";
  }

  return { message };
}

async function update(id, body) {
  const result = await db.query(`UPDATE aspects SET name='${body.name}',percentage=${body.percentage} WHERE id=${id}`);

  let message = "Error in updating aspect";

  if (result.affectedRows) {
    message = "aspect updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(`DELETE FROM aspects WHERE id=${id}`);

  let message = "Error in deleting aspect";

  if (result.affectedRows) {
    message = "aspect deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
