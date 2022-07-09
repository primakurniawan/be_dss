const db = require("./db");
const { emptyOrRows } = require("../helper");
const profileMatching = require("./profileMatching");
const { performance } = require("perf_hooks");

exports.getMultiple = async (category_id) => {
  console.log(category_id);
  const result = await db.query(
    `SELECT 
    activity_id, activities.name AS activity_name, 
    aspects.id AS aspect_id, aspects.name AS aspect_name, aspects.percentage AS aspect_percentage, criteria.id AS criteria_id, criteria.name AS criteria_name, criteria.percentage AS criteria_percentage, 
    parameter_id, parameters.name AS parameter_name, parameters.point,
    categories.id AS category_id, categories.name AS category_name 
    FROM activity_parameter 
    INNER JOIN activities ON activity_id=activities.id 
    INNER JOIN parameters ON parameter_id=parameters.id 
    INNER JOIN criteria ON parameters.criteria_id=criteria.id 
    INNER JOIN aspects ON criteria.aspect_id=aspects.id 
    INNER JOIN categories ON aspects.category_id=categories.id${category_id ? ` WHERE activities.category_id=${category_id}` : ""}
    GROUP BY activity_id, aspect_id, criteria_id, parameter_id`
  );

  const activities = [];

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

    const activity = {
      activity_id: element.activity_id,
      activity_name: element.activity_name,
      aspects: [aspect],
    };

    if (element.activity_id === activities[activities.length - 1]?.activity_id && activities.length !== 0) {
      if (element.aspect_id === activities[activities.length - 1].aspects[activities[activities.length - 1].aspects.length - 1]?.aspect_id) {
        activities[activities.length - 1].aspects[activities[activities.length - 1].aspects.length - 1].criteria.push(criteria);
      } else {
        activities[activities.length - 1].aspects.push(aspect);
      }
    } else {
      activities.push(activity);
    }
  });

  const data = emptyOrRows(activities);

  return data;
};

let totalRunningTime = 0;
let totalCall = 0;
let averageRunningTime = 0;

exports.getRankActivity = async (category_id, parameters_id) => {
  const resultActivities = await db.query(
    `SELECT 
    activity_id, activities.name AS activity_name, 
    aspects.id AS aspect_id, aspects.name AS aspect_name, aspects.percentage AS aspect_percentage, criteria.id AS criteria_id, criteria.name AS criteria_name, criteria.percentage AS criteria_percentage, 
    parameter_id, parameters.name AS parameter_name, parameters.point,
    categories.id AS category_id, categories.name AS category_name 
    FROM activity_parameter 
    INNER JOIN activities ON activity_id=activities.id 
    INNER JOIN parameters ON parameter_id=parameters.id 
    INNER JOIN criteria ON parameters.criteria_id=criteria.id 
    INNER JOIN aspects ON criteria.aspect_id=aspects.id 
    INNER JOIN categories ON activities.category_id=categories.id
    WHERE categories.id=${category_id}
    GROUP BY activity_id, aspect_id, criteria_id, parameter_id`
  );

  const activities = [];

  resultActivities.forEach((element) => {
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

    const activity = {
      activity_id: element.activity_id,
      activity_name: element.activity_name,
      aspects: [aspect],
    };

    if (element.activity_id === activities[activities.length - 1]?.activity_id && activities.length !== 0) {
      if (element.aspect_id === activities[activities.length - 1].aspects[activities[activities.length - 1].aspects.length - 1]?.aspect_id) {
        activities[activities.length - 1].aspects[activities[activities.length - 1].aspects.length - 1].criteria.push(criteria);
      } else {
        activities[activities.length - 1].aspects.push(aspect);
      }
    } else {
      activities.push(activity);
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
  const rank = profileMatching(activities, aspects);
  var endTime = performance.now();
  totalRunningTime += endTime - startTime;
  totalCall += 1;
  averageRunningTime = totalRunningTime / totalCall;

  console.log(`Call to rank took ${endTime - startTime} milliseconds`);
  console.log(`Average running time: ${averageRunningTime}`);

  return rank;
};

exports.create = async (category_id, name, parameters_id) => {
  const resultActivities = await db.query(`INSERT INTO activities(category_id, name) VALUES (${category_id},'${name}')`);

  const parameters = parameters_id.map((e) => {
    return `(${resultActivities.insertId},${e})`;
  });
  const result = await db.query(`INSERT INTO activity_parameter(activity_id, parameter_id) VALUES ${parameters.join(",")}`);

  let message = "Error in creating activity";

  if (result.affectedRows) {
    message = "activity created successfully";
  }

  return message;
};

exports.update = async (id, name, parameters_id) => {
  await db.query(`UPDATE activities SET name='${name}' WHERE id=${id}`);

  const deleteResult = await db.query(`DELETE FROM activity_parameter WHERE activity_id=${parseInt(id)}`);
  console.log(deleteResult.affectedRows);

  const parameters = parameters_id.map((e) => {
    return `(${id},${e})`;
  });
  const result = await db.query(`INSERT INTO activity_parameter(activity_id, parameter_id) VALUES ${parameters.join(",")}`);

  let message = "Error in updating activity";

  if (result.affectedRows) {
    message = "activity updated successfully";
  }

  return message;
};

exports.remove = async (id) => {
  await db.query(`DELETE FROM activity_parameter WHERE activity_id=${id}`);

  const result = await db.query(`DELETE FROM activities WHERE id=${id}`);

  let message = "Error in deleting activity";

  if (result.affectedRows) {
    message = "activity deleted successfully";
  }

  return message;
};
