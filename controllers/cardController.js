const {
  createCard,
  listCardsSortByIdAscending,
  getCardById,
  updateCard,
  deleteCard
} = require("../domain/card");
var debug = require("debug")("kanban-board-backend:controllers:cardController");

exports.list = async function(req, res, next) {
  debug("list cards");
  try {
    // express-jwt populates req.user with the contents of the decripted jwt token
    // as per https://github.com/auth0/express-jwt#express-jwt .
    // Jwt token is set (encrypted) and passed to the client in /authenticate .
    let cards = await listCardsSortByIdAscending(req.user.sub);
    res.json(cards);
  } catch (err) {
    return next(err);
  }
};

exports.post = async function(req, res, next) {
  debug("create card", req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
  }

  try {
    var card = await createCard(req.body, req.user.sub);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

exports.get = async function(req, res, next) {
  debug("get card", req.params.cardId);

  try {
    let card = await getCardById(req.params.cardId, req.user.sub);
    res.status(200).json(card);
  } catch (err) {
    return next(err);
  }
};

exports.put = async function(req, res, next) {
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

  try {
    var card = await updateCard(req.params.cardId, req.body, req.user.sub);
    res.status(200).json(card);
  } catch (err) {
    return next(err);
  }
};

exports.delete = async function(req, res, next) {
  debug("delete card", req.params.cardId);

  try {
    await deleteCard(req.params.cardId, req.user.sub);
    res.status(200).end();
  } catch (err) {
    return next(err);
  }
};
