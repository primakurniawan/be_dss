const db = require("./db");
const { emptyOrRows } = require("../helper");
const profileMatching = require("./profileMatching");
const { performance } = require("perf_hooks");

exports.getMultiple = async (category_id) => {
  console.log(category_id);
  const result = await db.query(
    `SELECT 
    alternative_id, alternatives.name AS alternative_name, 
    aspects.id AS aspect_id, aspects.name AS aspect_name, aspects.percentage AS aspect_percentage, criteria.id AS criteria_id, criteria.name AS criteria_name, criteria.percentage AS criteria_percentage, 
    parameter_id, parameters.name AS parameter_name, parameters.point,
    categories.id AS category_id, categories.name AS category_name 
    FROM alternative_parameter 
    INNER JOIN alternatives ON alternative_id=alternatives.id 
    INNER JOIN parameters ON parameter_id=parameters.id 
    INNER JOIN criteria ON parameters.criteria_id=criteria.id 
    INNER JOIN aspects ON criteria.aspect_id=aspects.id 
    INNER JOIN categories ON aspects.category_id=categories.id${category_id ? ` WHERE alternatives.category_id=${category_id}` : ""}
    GROUP BY alternative_id, aspect_id, criteria_id, parameter_id`
  );

  console.log(result);

  const alternatives = [];

  result.forEach((element) => {
    const criteria = {
      criteria_id: element.criteria_id,
      criteria_name: element.criteria_name,
      criteria_percentage: element.criteria_percentage,
      parameter: {
        parameter_id: element.parameter_id,
        parameter_name: element.parameter_name,
        point: element.point,
      },
    };

    const aspect = {
      aspect_id: element.aspect_id,
      aspect_name: element.aspect_name,
      aspect_percentage: element.aspect_percentage,
      criteria: [criteria],
    };

    const alternative = {
      alternative_id: element.alternative_id,
      alternative_name: element.alternative_name,
      aspects: [aspect],
    };

    if (element.alternative_id === alternatives[alternatives.length - 1]?.alternative_id && alternatives.length !== 0) {
      if (element.aspect_id === alternatives[alternatives.length - 1].aspects[alternatives[alternatives.length - 1].aspects.length - 1]?.aspect_id) {
        alternatives[alternatives.length - 1].aspects[alternatives[alternatives.length - 1].aspects.length - 1].criteria.push(criteria);
      } else {
        alternatives[alternatives.length - 1].aspects.push(aspect);
      }
    } else {
      alternatives.push(alternative);
    }
  });

  const data = emptyOrRows(alternatives);

  return data;
};

let totalRunningTime = 0;
let totalCall = 0;
let averageRunningTime = 0;

exports.getRankAlternative = async (category_id, parameters_id) => {
  const resultAlternatives = await db.query(
    `SELECT 
    alternative_id, alternatives.name AS alternative_name, 
    aspects.id AS aspect_id, aspects.name AS aspect_name, aspects.percentage AS aspect_percentage, criteria.id AS criteria_id, criteria.name AS criteria_name, criteria.percentage AS criteria_percentage, 
    parameter_id, parameters.name AS parameter_name, parameters.point,
    categories.id AS category_id, categories.name AS category_name 
    FROM alternative_parameter 
    INNER JOIN alternatives ON alternative_id=alternatives.id 
    INNER JOIN parameters ON parameter_id=parameters.id 
    INNER JOIN criteria ON parameters.criteria_id=criteria.id 
    INNER JOIN aspects ON criteria.aspect_id=aspects.id 
    INNER JOIN categories ON alternatives.category_id=categories.id
    WHERE categories.id=${category_id}
    GROUP BY alternative_id, aspect_id, criteria_id, parameter_id`
  );

  const alternatives = [];

  resultAlternatives.forEach((element) => {
    const criteria = {
      criteria_id: element.criteria_id,
      criteria_name: element.criteria_name,
      criteria_percentage: element.criteria_percentage,
      parameter: {
        parameter_id: element.parameter_id,
        parameter_name: element.parameter_name,
        point: element.point,
      },
    };

    const aspect = {
      aspect_id: element.aspect_id,
      aspect_name: element.aspect_name,
      aspect_percentage: element.aspect_percentage,
      criteria: [criteria],
    };

    const alternative = {
      alternative_id: element.alternative_id,
      alternative_name: element.alternative_name,
      aspects: [aspect],
    };

    if (element.alternative_id === alternatives[alternatives.length - 1]?.alternative_id && alternatives.length !== 0) {
      if (element.aspect_id === alternatives[alternatives.length - 1].aspects[alternatives[alternatives.length - 1].aspects.length - 1]?.aspect_id) {
        alternatives[alternatives.length - 1].aspects[alternatives[alternatives.length - 1].aspects.length - 1].criteria.push(criteria);
      } else {
        alternatives[alternatives.length - 1].aspects.push(aspect);
      }
    } else {
      alternatives.push(alternative);
    }
  });

  const resultParameters = await db.query(
    `SELECT 
    aspect_id, aspects.name AS aspect_name, aspects.percentage AS aspect_percentage, 
    criteria.id AS criteria_id, criteria.name AS criteria_name, criteria.percentage AS criteria_percentage, 
    parameters.id AS parameter_id,  parameters.name AS parameter_name, parameters.point,
    categories.id AS category_id, categories.name AS category_name 
    FROM parameters 
    INNER JOIN criteria ON criteria_id=criteria.id 
    INNER JOIN aspects ON aspect_id=aspects.id
    INNER JOIN categories ON aspects.category_id=categories.id
    WHERE parameters.id IN (${parameters_id.join(",")}) AND${category_id ? ` categories.id=${category_id}` : ""}
    GROUP BY aspect_id, criteria_id, parameter_id`
  );

  const aspects = [];
  resultParameters.forEach((element) => {
    const criteria = {
      criteria_id: element.criteria_id,
      criteria_name: element.criteria_name,
      criteria_percentage: element.criteria_percentage,
      parameter: {
        parameter_id: element.parameter_id,
        parameter_name: element.parameter_name,
        point: element.point,
      },
    };
    const aspect = {
      aspect_id: element.aspect_id,
      aspect_name: element.aspect_name,
      aspect_percentage: element.aspect_percentage,
      criteria: [criteria],
    };
    if (element.aspect_id === aspects[aspects.length - 1]?.aspect_id && aspects.length !== 0) {
      aspects[aspects.length - 1].criteria.push(criteria);
    } else {
      aspects.push(aspect);
    }
  });

  var startTime = performance.now();
  const rank = profileMatching(alternatives, aspects);
  var endTime = performance.now();
  totalRunningTime += endTime - startTime;
  totalCall += 1;
  averageRunningTime = totalRunningTime / totalCall;

  console.log(`Call to rank took ${endTime - startTime} milliseconds`);
  console.log(`Average running time: ${averageRunningTime}`);

  return rank;
};

exports.create = async (category_id, name, parameters_id) => {
  const resultAlternative = await db.query(`INSERT INTO alternatives(category_id, name) VALUES (${category_id},'${name}')`);

  const parameters = parameters_id.map((e) => {
    return `(${resultAlternative.insertId},${e})`;
  });
  const result = await db.query(`INSERT INTO alternative_parameter(alternative_id, parameter_id) VALUES ${parameters.join(",")}`);

  let message = "Error in creating alternative";

  if (result.affectedRows) {
    message = "alternative created successfully";
  }

  return message;
};

exports.update = async (id, name, parameters_id) => {
  await db.query(`UPDATE alternatives SET name='${name}' WHERE id=${id}`);

  const deleteResult = await db.query(`DELETE FROM alternative_parameter WHERE alternative_id=${parseInt(id)}`);
  console.log(deleteResult.affectedRows);

  const parameters = parameters_id.map((e) => {
    return `(${id},${e})`;
  });
  const result = await db.query(`INSERT INTO alternative_parameter(alternative_id, parameter_id) VALUES ${parameters.join(",")}`);

  let message = "Error in updating alternative";

  if (result.affectedRows) {
    message = "alternative updated successfully";
  }

  return message;
};

exports.remove = async (id) => {
  await db.query(`DELETE FROM alternative_parameter WHERE alternative_id=${id}`);

  const result = await db.query(`DELETE FROM alternatives WHERE id=${id}`);

  let message = "Error in deleting alternative";

  if (result.affectedRows) {
    message = "alternative deleted successfully";
  }

  return message;
};
