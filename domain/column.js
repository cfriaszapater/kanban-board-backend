var Column = require("../db/column");

exports.listColumns = async function listColumns() {
  return await Column.find()
    .sort([["id", "ascending"]])
    .exec();
};

exports.createColumn = async function createColumn(id, title, cardIds) {
  var column = new Column({
    id: id,
    title: title,
    cardIds: cardIds
  });
  column = await column.save();
  return column;
};

exports.getColumnById = async function getColumnById(columnId) {
  return await Column.findById(columnId);
};

exports.updateColumn = async function updateColumn(_id, id, title, cardIds) {
  var column = new Column({
    _id: _id,
    id: id,
    title: title,
    cardIds: cardIds
  });
  column = await Column.findByIdAndUpdate(_id, column);
  return column;
};

exports.deleteColumn = async function deleteColumn(columnId) {
  await Column.findByIdAndDelete(columnId);
};
