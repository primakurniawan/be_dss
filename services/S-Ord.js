const { LinkedList } = require("../LinkedList");

class SOrd {
  constructor(map) {
    this.map = map;
  }

  extractKeys(obj) {
    var keys = new LinkedList(),
      key;
    for (key in obj) {
      Object.prototype.hasOwnProperty.call(obj, key) && keys.add(key);
    }
    return keys;
  }

  sorter(a, b) {
    return parseFloat(a) - parseFloat(b);
  }

  findPaths(start, end) {
    var costs = {},
      open = { 0: new LinkedList().add(start) },
      predecessors = {},
      keys;

    var addToOpen = function (cost, vertex) {
      var key = "" + cost;
      if (!open[key]) open[key] = new LinkedList();
      open[key].add(vertex);
    };

    costs[start] = 0;

    while (open) {
      if (!(keys = this.extractKeys(open)).length) break;

      keys.sort();

      var key = keys.findElement(0).value,
        bucket = open[key],
        node = bucket.removeFrom(0),
        currentCost = parseFloat(key),
        adjacentNodes = this.map[node] || {};

      if (!bucket.size) delete open[key];

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
    var nodes = new LinkedList(),
      u = end;

    while (u !== undefined) {
      nodes.add(u);
      u = predecessors[u];
    }

    nodes.reverse();
    return nodes;
  }

  findShortestPath(start, end) {
    const predecessors = this.findPaths(start, end);

    const shortest = this.extractShortest(predecessors, end);

    return shortest.array;
  }
}

module.exports = SOrd;
