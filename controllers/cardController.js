var Card = require("../models/card");
var debug = require("debug")("kanban-board-backend:controllers:cardController");

exports.listCards = function(req, res, next) {
  debug("list cards");
  Card.find()
    .sort([["id", "ascending"]])
    .exec(function(err, cards) {
      if (err) {
        return next(err);
      }

      debug(cards);
      res.json(cards);
    });
};

exports.createCard = function(req, res, next) {
  debug("create card ", req.body);
  if (typeof req.body === "undefined") {
    res.status(400).send("baad conteeent");
  }
  var card = new Card({
    id: req.body.id,
    content: req.body.content
  });

  card.save().then(res.status(201).json(card));
};
