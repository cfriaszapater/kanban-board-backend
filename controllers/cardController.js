var Card = require("../models/card");
var debug = require("debug")("kanban-board-backend:controllers:cardController");

exports.cardsList = function(req, res, next) {
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
