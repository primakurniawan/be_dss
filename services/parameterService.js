const db = require("./db");
const { emptyOrRows } = require("../helper");
const config = require("../config");

async function getMultiple(category_id) {
  const rows = await db.query(`
    SELECT 
    parameters.id, parameters.name, parameters.point, 
    criteria.id AS criteria_id, criteria.name AS criteria_name, criteria.percentage AS criteria_percentage, 
    aspects.id AS aspect_id, aspects.name AS aspect_name, aspects.percentage AS aspect_percentage
    FROM parameters 
    INNER JOIN criteria ON parameters.criteria_id = criteria.id 
    INNER JOIN aspects ON criteria.aspect_id = aspects.id
    INNER JOIN categories ON aspects.category_id = categories.id${category_id ? ` WHERE category_id=${category_id}` : ""}
  `);

  const data = emptyOrRows(rows);

  return data;
}

async function create(criteria_id, name, point) {
  const result = await db.query(`INSERT INTO parameters(criteria_id, name, point) VALUES (${criteria_id},'${name}',${point})`);

  let message = "Error in creating parameter";

  if (result.affectedRows) {
    message = "parameter created successfully";
  }

  return message;
}

async function update(id, name, point) {
  const result = await db.query(`UPDATE parameters SET name='${name}', point=${point} WHERE id=${id}`);

  let message = "Error in updating parameter";

  if (result.affectedRows) {
    message = "parameter updated successfully";
  }

  return message;
}

async function remove(id) {
  const result = await db.query(`DELETE FROM parameters WHERE id=${id}`);

  let message = "Error in deleting parameter";

  if (result.affectedRows) {
    message = "parameter deleted successfully";
  }

  return message;
}

async function getParametersDetail(category_id) {
  const result = await db.query(
    `SELECT 
    aspects.id AS aspect_id, aspects.name AS aspect_name, aspects.percentage AS aspect_percentage, 
    criteria.id AS criteria_id, criteria.name AS criteria_name, criteria.percentage AS criteria_percentage, 
    parameters.id, parameters.name, parameters.point, 
    categories.id AS category_id, categories.name AS category_name
    FROM parameters 
    INNER JOIN criteria ON parameters.criteria_id=criteria.id 
    INNER JOIN aspects ON criteria.aspect_id=aspects.id
    INNER JOIN categories ON aspects.category_id=categories.id${category_id ? ` WHERE category_id=${category_id}` : ""}
    `
  );

  const aspects = [];
  result.forEach((element) => {
    const parameter = {
      id: element.id,
      name: element.name,
      point: element.point,
    };
    const criteria = {
      criteria_id: element.criteria_id,
      criteria_name: element.criteria_name,
      criteria_percentage: element.criteria_percentage,
      parameters: [parameter],
    };
    const aspect = {
      aspect_id: element.aspect_id,
      aspect_name: element.aspect_name,
      aspect_percentage: element.aspect_percentage,
      criteria: [criteria],
    };

    if (element.aspect_id === aspects[aspects.length - 1]?.aspect_id && aspects.length !== 0) {
      if (element.criteria_id === aspects[aspects.length - 1].criteria[aspects[aspects.length - 1].criteria.length - 1].criteria_id) {
        aspects[aspects.length - 1].criteria[aspects[aspects.length - 1].criteria.length - 1].parameters.push(parameter);
      } else {
        aspects[aspects.length - 1].criteria.push(criteria);
      }
    } else {
      aspects.push(aspect);
    }
  });

  const data = emptyOrRows(aspects);

  return data;
}

module.exports = {
  getMultiple,
  getParametersDetail,
  create,
  update,
  remove,
};
