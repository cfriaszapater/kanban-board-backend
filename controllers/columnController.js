const {
  listColumns,
  createColumn,
  getColumnById,
  updateColumn,
  deleteColumn
} = require("../domain/column");
const debug = require("debug")(
  "kanban-board-backend:controllers:columnController"
);
const { validateNotEmpty } = require("./validateNotEmpty");
const { BadRequestError } = require("../domain/error/BadRequestError");
const { NotFoundError } = require("../domain/error/NotFoundError");

exports.list = async function(req, res, next) {
  debug("list columns");
  try {
    let columns = await listColumns(req.user.sub);
    res.json(columns);
  } catch (err) {
    return next(err);
  }
};

exports.create = async function(req, res, next) {
  debug("create column", req.body);
  try {
    validateNotEmpty(req.body);

    var column = await createColumn(req.body, req.user.sub);
    res.status(201).json(column);
  } catch (err) {
    next(err);
  }
};

exports.get = async function(req, res, next) {
  debug("get column", req.params.columnId);

  try {
    let column = await getColumnById(req.params.columnId, req.user.sub);

    if (column == null) {
      throw new NotFoundError(
        "column with id " + req.params.columnId + " not found"
      );
    }

    res.status(200).json(column);
  } catch (err) {
    return next(err);
  }
};

exports.update = async function(req, res, next) {
  debug("update column", req.params.columnId, req.body);

  try {
    validateNotEmpty(req.body);
    if (req.params.columnId !== req.body._id) {
      throw new BadRequestError(
        "_id in path param does not match the one in body"
      );
    }

    var column = await updateColumn(
      req.params.columnId,
      req.body,
      req.user.sub
    );
    res.status(200).json(column);
  } catch (err) {
    return next(err);
  }
};

exports.delete = async function(req, res, next) {
  debug("delete column", req.params.columnId);

  try {
    await deleteColumn(req.params.columnId, req.user.sub);
    res.status(200).end();
  } catch (err) {
    return next(err);
  }
};
