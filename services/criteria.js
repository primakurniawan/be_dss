const db = require("./db");
const { emptyOrRows } = require("../helper");
const config = require("../config");

async function getMultiple(query) {
  const rows =
    await db.query(`SELECT criteria.id AS criteria_id, criteria.name AS criteria_name, criteria.percentage AS criteria_percentage, aspects.id AS aspect_id, aspects.name AS aspect_name, aspects.percentage AS aspect_percentage FROM criteria INNER JOIN aspects ON criteria.aspect_id = aspects.id ${
      query.aspect_id ? `WHERE aspect_id=${query.aspect_id};` : ""
    } 
  `);
  const data = emptyOrRows(rows);

  return {
    data,
  };
}

async function create(body) {
  const result = await db.query(`
  INSERT INTO criteria(aspect_id, name, percentage) VALUES (${body.aspect_id},'${body.name}',${body.percentage});
`);

  let message = "Error in creating criteria";

  if (result.affectedRows) {
    message = "criteria created successfully";
  }

  return { message };
}

async function update(id, body) {
  const result = await db.query(`UPDATE criteria SET name='${body.name}',percentage=${body.percentage} WHERE id=${id}`);

  let message = "Error in updating criteria";

  if (result.affectedRows) {
    message = "criteria updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(`DELETE FROM criteria WHERE id=${id}`);

  let message = "Error in deleting criteria";

  if (result.affectedRows) {
    message = "criteria deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
