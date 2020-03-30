const { token, createUser } = require("../domain/user");
const debug = require("debug")(
  "kanban-board-backend:controllers:userController"
);
const { validateNotEmpty } = require("./validateNotEmpty");
const { BadRequestError } = require("../domain/error/BadRequestError");

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

  try {
    validateNotEmpty(req.body);

    var user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
