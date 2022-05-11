const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple(query) {
  const rows =
    await db.query(`SELECT parameters.id, parameters.name, parameters.point FROM parameters INNER JOIN criteria ON parameters.criteria_id = criteria.id WHERE criteria_id=${query.criteria_id};
  `);
  const data = helper.emptyOrRows(rows);

  return {
    data,
  };
}

async function create(body) {
  const result = await db.query(`INSERT INTO parameters(criteria_id, name, point) VALUES (${body.criteria_id},'${body.parameter}',${body.point})`);

  let message = "Error in creating parameter";

  if (result.affectedRows) {
    message = "parameter created successfully";
  }

  return { message };
}

async function update(id, body) {
  const result = await db.query(`UPDATE parameters SET name='${body.name}', point=${body.point} WHERE id=${id}`);

  let message = "Error in updating parameter";

  if (result.affectedRows) {
    message = "parameter updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(`DELETE FROM parameters WHERE id=${id}`);

  let message = "Error in deleting parameter";

  if (result.affectedRows) {
    message = "parameter deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
