var Column = require("../db/column");

exports.listColumns = async function listColumns(userId) {
  return await Column.find({ user: userId })
    .sort([["id", "ascending"]])
    .exec();
};

exports.createColumn = async function createColumn(column, userId) {
  column = new Column({
    ...column,
    user: userId
  });
  return await column.save();
};

exports.getColumnById = async function getColumnById(columnId, userId) {
  const column = await Column.findById(columnId);
  checkUserOwnsColumn(column, userId);
  return column;
};

function checkUserOwnsColumn(column, userId) {
  if (column.user !== userId) {
    throw new Error(
      "User " + userId + "unauthorized on columnId " + column._id
    );
  }
}

exports.updateColumn = async function updateColumn(_id, column, userId) {
  return await Column.findOneAndUpdate({ _id: _id, user: userId }, column);
};

exports.deleteColumn = async function deleteColumn(columnId, userId) {
  const column = await Column.findByIdAndDelete(columnId);
  checkUserOwnsColumn(column, userId);
};
