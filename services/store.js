const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const { default: axios } = require("axios");
const Graph = require("./graph");

async function getShortestPathStore(currentLocation, storeId) {
  const rows = await db.query(`SELECT * FROM stores`);
  const iteration = rows.length % 24;
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
  const graph = new Graph(map);

  const shortestPath = graph.findShortestPath(0, storeId).map((e) => parseInt(e));
  const rowRoutes = [];
  shortestPath.forEach((e, i) => {
    if (e !== 0 || i !== 0) rowRoutes.push(rows.filter((row) => row.id === e)[0]);
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

  return {
    rowRoutes,
    routes: routes.data,
  };
}

async function getMultiple() {
  const rows = await db.query(`SELECT * FROM stores;`);
  const data = helper.emptyOrRows(rows);

  return {
    data,
  };
}

async function create(body) {
  const result = await db.query(`INSERT INTO stores(name, address, contact, lon, lat) VALUES ('${body.name}','${body.address}','${body.contact}',${body.lon},${body.lat})`);

  let message = "Error in creating stores";

  if (result.affectedRows) {
    message = "Stores created successfully";
  }

  return { message };
}

async function update(id, body) {
  console.log(body);
  const result = await db.query(`UPDATE stores SET name='${body.name}',address='${body.address}',contact='${body.contact}',lon='${body.lon}',lat='${body.lat}' WHERE id=${id}`);

  let message = "Error in updating stores";

  if (result.affectedRows) {
    message = "Stores updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(`DELETE FROM stores WHERE id=${id}`);

  let message = "Error in deleting stores";

  if (result.affectedRows) {
    message = "Stores deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  getShortestPathStore,
};
