var Card = require("../db/card");
var Column = require("../db/column");

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

exports.getCardById = async function getById(req) {
  return await Card.findById(req.params.cardId);
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

exports.deleteCard = async function deleteCard(req) {
  await Card.findByIdAndDelete(req.params.cardId);
};
