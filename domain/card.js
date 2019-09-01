var Card = require("../db/card");

exports.createCard = async function createCard(cardId, cardContent) {
  var card = new Card({
    id: cardId,
    content: cardContent
  });
  card = await card.save();
  addCardInFirstColumn(card);
  return card;
};

async function addCardInFirstColumn(card) {
  // TODO
  return card;
}
