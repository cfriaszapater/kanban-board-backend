const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../auth/jwt");
const User = require("../db/user");
const { compare, hash } = require("./password");
const util = require("util");
const { BadRequestError } = require("./error/BadRequestError");
const { AlreadyExistsError } = require("./error/AlreadyExistsError");
const debug = require("debug")("kanban-board-backend:domain:user");

const sign = util.promisify(jwt.sign);

exports.token = async function token({ username, password }) {
  const user = await User.findOne({ username: username })
    .sort([["username", "ascending"]])
    .exec();
  if (user && (await compare(password, user.password))) {
    return await sign({ sub: user._id }, jwtSecret(), { expiresIn: "1 day" });
  }
};

exports.createUser = async function createUser(reqUser) {
  try {
    if (!reqUser.username || !reqUser.password) {
      throw new BadRequestError("Username and password are required");
    }

    const hashedPassword = await hash(reqUser.password);
    const user = new User({
      ...reqUser,
      password: hashedPassword
    });
    return await user.save();
  } catch (err) {
    if (
      err.name === "MongoError" &&
      err.message.startsWith("E11000") // duplicate key error
    ) {
      throw new AlreadyExistsError("Username already exists");
    }
    throw err;
  }
};
