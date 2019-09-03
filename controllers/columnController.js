const {
  listColumns,
  createColumn,
  getColumnById,
  updateColumn,
  deleteColumn
} = require("../domain/column");
const { Column } = require("../db/column");
var debug = require("debug")(
  "kanban-board-backend:controllers:columnController"
);

exports.list = async function(req, res, next) {
  debug("list columns");
  try {
    let columns = await listColumns();
    res.json(columns);
  } catch (err) {
    return next(err);
  }
};

exports.create = async function(req, res, next) {
  debug("create column", req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
  }

  try {
    var column = await createColumn(
      req.body.id,
      req.body.title,
      req.body.cardIds
    );
    res.status(201).json(column);
  } catch (err) {
    next(err);
  }
};

exports.get = async function(req, res, next) {
  debug("get column", req.params.columnId);

  try {
    let column = await getColumnById(req.params.columnId);

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

exports.update = async function(req, res, next) {
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

  try {
    var column = await updateColumn(
      new Column({
        _id: req.params.columnId,
        id: req.body.id,
        title: req.body.title,
        cardIds: req.body.cardIds
      })
    );
    res.status(200).json(column);
  } catch (err) {
    return next(err);
  }
};

exports.delete = async function(req, res, next) {
  debug("delete column", req.params.columnId);

  try {
    await deleteColumn(req.params.columnId);
    res.status(200).end();
  } catch (err) {
    return next(err);
  }
};
