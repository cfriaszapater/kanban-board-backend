var Card = require("../models/card");
var debug = require("debug")("kanban-board-backend:controllers:cardController");

exports.listCards = async function(req, res, next) {
  debug("list cards");
  try {
    let cards = await Card.find()
      .sort([["id", "ascending"]])
      .exec();
    debug(cards);
    res.json(cards);
  } catch (err) {
    return next(err);
  }
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
    card = await card.save();
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

exports.updateCard = async function(req, res, next) {
  debug("update card", req.params.cardId, req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
  }
  if (req.params.cardId !== req.body._id) {
    res.statusMessage = "_id in path param does not match the one in body";
    res.status(400).end();
    return next();
  }

  var card = new Card({
    _id: req.params.cardId,
    id: req.body.id,
    content: req.body.content
  });

  try {
    card = await Card.findByIdAndUpdate(req.params.cardId, card);
    res.status(200).json(card);
  } catch (err) {
    return next(err);
  }
};

exports.deleteCard = async function(req, res, next) {
  debug("delete card", req.params.cardId);

  try {
    await Card.findByIdAndDelete(req.params.cardId);
    res.status(200).end();
  } catch (err) {
    return next(err);
  }
};
