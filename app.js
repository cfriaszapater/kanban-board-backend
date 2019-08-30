var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var debug = require("debug")("kanban-board-backend:app");
var bunyan = require("bunyan");
var log = bunyan.createLogger({ name: "kanban-board-backend" });
var compression = require("compression");
var helmet = require("helmet");
var indexRouter = require("./routes/index");
var cardsRouter = require("./routes/cards");

var app = express();

// Add security by setting some standard headers
app.use(helmet());
// Compress all routes
app.use(compression());
// Log HTTP requests in dev env
app.use(morgan("dev"));
// Parse incoming requests with JSON payload in body
app.use(express.json());
dbConnectionSetup();

app.use("/", indexRouter);
app.use("/cards", cardsRouter);

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
  var devUri =
    "mongodb+srv://admin:DZWkrlyCyhLimrez@cluster0-pmxkl.azure.mongodb.net/kanban_board?retryWrites=true&w=majority";
  return process.env.MONGODB_URI || devUri;
}
