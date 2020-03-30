const express = require("express");
const httpLogger = require("morgan");
const mongoose = require("mongoose");
const debug = require("debug")("kanban-board-backend:app");
const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "kanban-board-backend" });
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const indexRouter = require("./routes/index");
const cardsRouter = require("./routes/cards");
const columnsRouter = require("./routes/columns");
const usersRouter = require("./routes/users");
const { handleError } = require("./controllers/handleError");
const { jwt } = require("./auth/jwt");

const app = express();

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
  const db = mongoose.connection;
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
  const { status, responseBody } = handleError(err);

  res.status(status).json(responseBody);
}
