var Card = require("../db/card");
var Column = require("../db/column");
var { listColumns, updateColumn } = require("./column");
var debug = require("debug")("kanban-board-backend:domain:card");

exports.createCard = async function createCard(cardId, cardContent) {
  var card = new Card({
    id: cardId,
    content: cardContent
  });
  card = await card.save();
  await addCardInFirstColumn(card);
  return card;
};

async function addCardInFirstColumn(card) {
  let firstCol = await firstColumn();
  firstCol.cardIds.push(card.id);
  await firstCol.save();
}

async function firstColumn() {
  return await Column.findOne()
    .sort([["id", "ascending"]])
    .exec();
}

exports.getCardById = async function getById(cardId) {
  return await Card.findById(cardId);
};

exports.listCardsSortByIdAscending = async function listSortByIdAscending() {
  let cards = await Card.find()
    .sort([["id", "ascending"]])
    .exec();
  return cards;
};

exports.updateCard = async function updateCard(_id, id, content) {
  var card = new Card({
    _id: _id,
    id: id,
    content: content
  });
  card = await Card.findByIdAndUpdate(_id, card);
  return card;
};

exports.deleteCard = async function deleteCard(cardId) {
  // card.id is "frontend id", card._id is "backend id". Need to find card in columns by "card.id" here:
  const card = await Card.findById(cardId);
  debug("card to delete: " + card);
  await deleteCardFromColumns(card.id);

  await Card.findByIdAndDelete(cardId);
};

async function deleteCardFromColumns(cardFrontendId) {
  const column = await columnContainingCard(cardFrontendId);
  debug("columnContainingCard = " + JSON.stringify(column));
  const updatedColumn = columnWithoutCard(column, cardFrontendId);
  debug("column to update: " + JSON.stringify(updatedColumn));
  await updateColumn(updatedColumn);
  debug(
    "Deleted card " +
      cardFrontendId +
      " from column " +
      column._id +
      ", result cardIds: " +
      updatedColumn.cardIds
  );
}

async function columnContainingCard(cardFrontendId) {
  const columns = await listColumns();
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.cardIds.includes(cardFrontendId)) {
      return column;
    }
  }
  throw new Error("No column contains card with frontend id " + cardFrontendId);
}

function columnWithoutCard(column, cardFrontendId) {
  const newCardIds = Array.from(column.cardIds);
  newCardIds.splice(newCardIds.indexOf(cardFrontendId), 1);
  const updatedColumn = new Column({
    _id: column._id,
    id: column.id,
    title: column.title,
    cardIds: newCardIds
  });

  return updatedColumn;
}
