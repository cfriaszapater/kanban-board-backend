const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../auth/jwt");
const User = require("../db/user");
const { compare, hash } = require("./password");
const util = require("util");
var debug = require("debug")("kanban-board-backend:domain:user");

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
  if (!reqUser.username || !reqUser.password) {
    throw new Error("Username and password are required");
  }

  const hashedPassword = await hash(reqUser.password);
  debug("hashedPassword: " + hashedPassword);
  const user = new User({
    ...reqUser,
    password: hashedPassword
  });
  return await user.save();
};
