var Column = require("../models/column");
var debug = require("debug")(
  "kanban-board-backend:controllers:columnController"
);

exports.listColumns = async function(req, res, next) {
  debug("list columns");
  try {
    let columns = await Column.find()
      .sort([["id", "ascending"]])
      .exec();
    debug(columns);
    res.json(columns);
  } catch (err) {
    return next(err);
  }
};

exports.createColumn = async function(req, res, next) {
  debug("create column", req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
  }

  var column = new Column({
    id: req.body.id,
    title: req.body.title,
    taskIds: req.body.taskIds
  });

  try {
    column = await column.save();
    res.status(201).json(column);
  } catch (err) {
    next(err);
  }
};

exports.getColumn = async function(req, res, next) {
  debug("get column", req.params.columnId);

  try {
    let column = await Column.findById(req.params.columnId);
    if (column == null) {
      res.statusMessage =
        "column with id " + req.params.columnId + " not found";
      res.status(404).end();
      return next();
    }
    res.status(200).json(column);
  } catch (err) {
    return next(err);
  }
};

exports.updateColumn = async function(req, res, next) {
  debug("update column", req.params.columnId, req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
  }
  if (req.params.columnId !== req.body._id) {
    res.statusMessage = "_id in path param does not match the one in body";
    res.status(400).end();
    return next();
  }

  var column = new Column({
    _id: req.params.columnId,
    id: req.body.id,
    title: req.body.title,
    taskIds: req.body.taskIds
  });

  try {
    column = await Column.findByIdAndUpdate(req.params.columnId, column);
    res.status(200).json(column);
  } catch (err) {
    return next(err);
  }
};

exports.deleteColumn = async function(req, res, next) {
  debug("delete column", req.params.columnId);

  try {
    await Column.findByIdAndDelete(req.params.columnId);
    res.status(200).end();
  } catch (err) {
    return next(err);
  }
};
