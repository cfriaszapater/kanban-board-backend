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

// Express requires error handling middleware to keep the 4-arg signature, even if 'next' arg is not used
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Invalid Token" });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}
