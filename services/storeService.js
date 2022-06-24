const db = require("./db");
const helper = require("../helper");
const { default: axios } = require("axios");
const findShortestPath = require("./S-Ord");
const { performance } = require("perf_hooks");

let totalRunningTime = 0;
let totalCall = 0;
let averageRunningTime = 0;

async function getShortestPathStore(category_id, currentLocation, storeId) {
  const rows = await db.query(`SELECT * FROM stores${category_id ? ` WHERE category_id=${category_id}` : ""}`);
  // const iteration = rows.length % 24;
  // const distanceRow = [];
  // for (let i = 0; i < iteration; i++) {}
  let storesCoordinates = ``;
  rows.forEach((store) => {
    storesCoordinates += `${store.lon},${store.lat};`;
  });
  storesCoordinates = storesCoordinates.slice(0, -1);

  const matrix = await axios.get(
    `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${currentLocation[0]},${currentLocation[1]};${storesCoordinates}?access_token=pk.eyJ1IjoicHJpbWFrdXJuaWF3YW4iLCJhIjoiY2wzamVrOHhvMDZyMzNqbzQ1cmt4anJ0ZCJ9.plWxz32egjvGNLpCZL9uVg&annotations=distance,duration`
  );

  const map = {};
  matrix.data.distances.forEach((distance, i) => {
    if (i === 0) map[0] = {};
    else map[rows[i - 1].id] = {};
    distance.map((e, j) => {
      if (i === 0 && j !== 0) map[0][rows[j - 1].id] = e;
      else if (i !== 0 && j === 0) map[rows[i - 1].id][0] = e;
      else if (i !== 0 && j !== 0 && i !== j) map[rows[i - 1].id][rows[j - 1].id] = e;
    });
  });

  var startTime = performance.now();
  const shortestPath = findShortestPath(map, 0, storeId).map((e) => parseInt(e));
  var endTime = performance.now();
  totalRunningTime += endTime - startTime;
  totalCall += 1;
  averageRunningTime = totalRunningTime / totalCall;

  console.log(`Call to shortestPath took ${endTime - startTime} milliseconds`);
  console.log(`Average running time: ${averageRunningTime}`);

  const rowRoutes = [];
  shortestPath.forEach((e, i) => {
    if (e !== 0) rowRoutes.push(rows.filter((row) => row.id === e)[0]);
  });

  let routesCoordinates = ``;
  let routesNames = `awal;`;
  rowRoutes.forEach((store) => {
    routesCoordinates += `${store.lon},${store.lat};`;
    routesNames += `${store.name !== undefined ? store.name.replace(" ", "%20") : "none"};`;
  });
  routesCoordinates = routesCoordinates.slice(0, -1);
  routesNames = routesNames.slice(0, -1);

  const routes = await axios.get(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${currentLocation[0]},${currentLocation[1]};${routesCoordinates}?access_token=pk.eyJ1IjoicHJpbWFrdXJuaWF3YW4iLCJhIjoiY2wzamVrOHhvMDZyMzNqbzQ1cmt4anJ0ZCJ9.plWxz32egjvGNLpCZL9uVg&continue_straight=false&overview=simplified&steps=true&language=id&waypoint_names=${routesNames}&geometries=geojson`
  );

  return routes.data;
}

async function getMultiple(category_id) {
  const rows = await db.query(`SELECT * FROM stores${category_id ? ` WHERE category_id=${category_id}` : ""}`);
  const data = helper.emptyOrRows(rows);

  return data;
}

async function create(category_id, name, address, contact, lon, lat) {
  const result = await db.query(`INSERT INTO stores(category_id, name, address, contact, lon, lat) VALUES (${category_id},'${name}','${address}','${contact}',${lon},${lat})`);

  let message = "Error in creating stores";

  if (result.affectedRows) {
    message = "Stores created successfully";
  }

  return message;
}

async function update(id, name, address, contact, lon, lat) {
  const result = await db.query(`UPDATE stores SET name='${name}',address='${address}',contact='${contact}',lon='${lon}',lat='${lat}' WHERE id=${id}`);

  let message = "Error in updating stores";

  if (result.affectedRows) {
    message = "Stores updated successfully";
  }

  return message;
}

async function remove(id) {
  const result = await db.query(`DELETE FROM stores WHERE id=${id}`);

  let message = "Error in deleting stores";

  if (result.affectedRows) {
    message = "Stores deleted successfully";
  }

  return message;
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  getShortestPathStore,
};
