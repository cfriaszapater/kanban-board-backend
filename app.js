var express = require("express");
var httpLogger = require("morgan");
var mongoose = require("mongoose");
var debug = require("debug")("kanban-board-backend:app");
var bunyan = require("bunyan");
var log = bunyan.createLogger({ name: "kanban-board-backend" });
var cors = require("cors");
var compression = require("compression");
var helmet = require("helmet");
var indexRouter = require("./routes/index");
var cardsRouter = require("./routes/cards");
var columnsRouter = require("./routes/columns");
const usersRouter = require("./routes/users");
const { jwt } = require("./auth/jwt");
const errorHandler = require("./auth/error-handler");

var app = express();

// Add security by setting some standard headers
app.use(helmet());
// Compress all routes
app.use(compression());
// Log HTTP requests (with dev info while we are in development mode)
app.use(httpLogger("dev"));
// Parse incoming requests with JSON payload in body
app.use(express.json());
dbConnectionSetup();
app.use(cors());
// use JWT auth to secure the api
app.use(jwt());

app.use("/", indexRouter);
app.use("/cards", cardsRouter);
app.use("/columns", columnsRouter);
app.use("/users", usersRouter);

// global error handler
app.use(errorHandler);

module.exports = app;

function dbConnectionSetup() {
  debug("connecting to db...");
  mongoose
    .connect(dbUri(), {
      useNewUrlParser: true
    })
    .then(debug("...connected to db"));
  var db = mongoose.connection;
  db.on("error", err => log.error("DB connection error: %s", err));
}

function dbUri() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI env var is not set, cannot connect to DB");
  }
  return process.env.MONGODB_URI;
}
