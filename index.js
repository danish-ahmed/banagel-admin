const winston = require("winston");
const express = require("express");
const range = require("express-range");
const config = require("config");
const app = express();

require("./startup/logging")();
require("./startup/cors")(app);
app.use(
  range({
    accept: "items",
    limit: 20,
  })
);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
console.log(port);
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
