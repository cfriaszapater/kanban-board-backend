const { token, createUser } = require("../domain/user");
var debug = require("debug")("kanban-board-backend:controllers:userController");

exports.postToken = function postToken(req, res, next) {
  token(req.body)
    .then(userAndToken =>
      userAndToken
        ? res.json(userAndToken)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch(err => next(err));
};

exports.post = async function post(req, res, next) {
  debug("create user", req.body.username);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
  }

  try {
    var user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (
      err.name === "MongoError" &&
      err.message.startsWith("E11000 duplicate key error")
    ) {
      res.status(400).json({ message: "Username already exists" });
    }
    next(err);
  }
};
