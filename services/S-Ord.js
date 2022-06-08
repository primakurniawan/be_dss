class SOrd {
  constructor(map) {
    this.map = map;
  }

  extractKeys(obj) {
    var keys = [],
      key;
    for (key in obj) {
      Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
    }
    return keys;
  }

  sorter(a, b) {
    return parseFloat(a) - parseFloat(b);
  }

  findPaths(start, end) {
    var costs = {},
      open = { 0: [start] },
      predecessors = {},
      keys;

    var addToOpen = function (cost, vertex) {
      var key = "" + cost;
      if (!open[key]) open[key] = [];
      open[key].push(vertex);
    };

    costs[start] = 0;

    while (open) {
      console.log("open", open);
      if (!(keys = this.extractKeys(open)).length) break;

      keys.sort(this.sorter);

      console.log("keys", keys);

      var key = keys[0],
        bucket = open[key],
        node = bucket.shift(),
        currentCost = parseFloat(key),
        adjacentNodes = this.map[node] || {};

      if (!bucket.length) delete open[key];

      for (var vertex in adjacentNodes) {
        if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
          var cost = adjacentNodes[vertex],
            totalCost = cost + currentCost,
            vertexCost = costs[vertex];

          if (vertexCost === undefined || vertexCost > totalCost) {
            costs[vertex] = totalCost;
            addToOpen(totalCost, vertex);
            predecessors[vertex] = node;
          }
        }
      }
    }

    if (costs[end] === undefined) {
      return null;
    } else {
      return predecessors;
    }
  }

  extractShortest(predecessors, end) {
    var nodes = [],
      u = end;

    while (u !== undefined) {
      nodes.push(u);
      u = predecessors[u];
    }

    nodes.reverse();
    return nodes;
  }

  findShortestPath(start, end) {
    const predecessors = this.findPaths(start, end);

    const shortest = this.extractShortest(predecessors, end);

    return shortest;
  }
}

module.exports = SOrd;
