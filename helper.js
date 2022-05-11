function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function formatSnakeCase(str) {
  return str.replace(/ /g, "_");
}

module.exports = {
  getOffset,
  emptyOrRows,
  formatSnakeCase,
};
