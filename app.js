/* jshint esversion: 8 */

var createError = require("http-errors");
var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
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

// XXX decide if any of these are needed:
// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: false
//   })
// );
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

dbConnectionSetup();

app.use("/", indexRouter);
app.use("/cards", cardsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

function dbConnectionSetup() {
  mongoose
    .connect(dbUri(), {
      useNewUrlParser: true
    })
    .then(debug("connected to db"));
  var db = mongoose.connection;
  db.on("error", err => log.error("DB connection error: %s", err));
}

function dbUri() {
  var devUri =
    "mongodb+srv://admin:DZWkrlyCyhLimrez@cluster0-pmxkl.azure.mongodb.net/local_library?retryWrites=true&w=majority";
  return process.env.MONGODB_URI || devUri;
}
