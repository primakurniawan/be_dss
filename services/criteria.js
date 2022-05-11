const db = require("./db");
const { formatSnakeCase, emptyOrRows } = require("../helper");
const config = require("../config");

async function getMultiple(query) {
  const rows = await db.query(`SELECT criteria.id, criteria.name, criteria.percentage FROM criteria INNER JOIN aspects ON criteria.aspect_id = aspects.id WHERE aspect_id=${query.aspect_id};
  `);
  const data = emptyOrRows(rows);

  return {
    data,
  };
}

async function create(body) {
  const result = await db.query(`
  INSERT INTO criteria(aspect_id, name) VALUES (${body.aspect_id},'${body.name}');
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
