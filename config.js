const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "localhost",
    user: "root",
    password: "",
    database: "dss_gadget",
  },
  listPerPage: 10,
  multipleStatements: true,
};
module.exports = config;
