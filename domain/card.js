const Card = require("../db/card");
const Column = require("../db/column");
const { listColumns, updateColumn } = require("./column");
const debug = require("debug")("kanban-board-backend:domain:card");
const { ForbiddenError } = require("./error/ForbiddenError");
const { NotFoundError } = require("./error/NotFoundError");

exports.createCard = async function createCard(card, userId) {
  card = new Card({
    ...card,
    user: userId
  });
  debug("card to save: " + card);
  card = await card.save();
  debug("saved card: " + card);
  await addCardInFirstColumn(card);
  return card;
};

async function addCardInFirstColumn(card) {
  let firstCol = await firstColumn(card.user);
  firstCol.cardIds.push(card.id);
  await firstCol.save();
}

async function firstColumn(userId) {
  return await Column.findOne({ user: userId })
    .sort([["id", "ascending"]])
    .exec();
}

exports.getCardById = async function getById(cardId, userId) {
  const card = await Card.findById(cardId);
  checkUserOwnsCard(card, userId);
  return card;
};

function checkUserOwnsCard(card, userId) {
  debug("checkUserOwnsCard(card.user, userId):", card.user, userId);
  if (card.user != userId) {
    throw new ForbiddenError(
      "User " + userId + " unauthorized on card " + card
    );
  }
}

exports.listCardsSortByIdAscending = async function listSortByIdAscending(
  userId
) {
  let cards = await Card.find({ user: userId })
    .sort([["id", "ascending"]])
    .exec();
  return cards;
};

exports.updateCard = async function updateCard(_id, card, userId) {
  return await Card.findOneAndUpdate({ _id: _id, user: userId }, card);
};

exports.deleteCard = async function deleteCard(cardId, userId) {
  // card.id is "frontend id", card._id is "backend id". Need to find card in columns by "card.id" here:
  const card = await Card.findById(cardId);
  checkUserOwnsCard(card, userId);

  debug("card to delete: " + card);
  await deleteCardFromColumns(card);
  await Card.findByIdAndDelete(cardId);
};

async function deleteCardFromColumns(card) {
  const column = await columnContainingCard(card.id, card.user);
  debug("columnContainingCard = " + JSON.stringify(column));
  const columnToUpdate = columnWithoutCard(column, card.id);
  debug("column to update: " + JSON.stringify(columnToUpdate));
  await updateColumn(columnToUpdate._id, columnToUpdate, card.user);
  debug(
    "Deleted card with frontendId " +
      card.id +
      " from column " +
      column._id +
      ", result cardIds: " +
      columnToUpdate.cardIds
  );
}

async function columnContainingCard(cardFrontendId, userId) {
  const columns = await listColumns(userId);
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.cardIds.includes(cardFrontendId)) {
      return column;
    }
  }
  throw new NotFoundError(
    "No column contains card with frontend id " + cardFrontendId
  );
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
