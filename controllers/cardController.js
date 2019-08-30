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

exports.createCard = async function(req, res, next) {
  debug("create card", req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
  }

  var card = new Card({
    id: req.body.id,
    content: req.body.content
  });

  try {
    await card.save();
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};
