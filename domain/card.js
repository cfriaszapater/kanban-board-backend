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
