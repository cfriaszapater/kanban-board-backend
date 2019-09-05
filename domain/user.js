const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../auth/jwt");
const User = require("../db/user");
const { compare, hash } = require("./password");
var debug = require("debug")("kanban-board-backend:domain:user");

exports.token = async function token({ username, password }) {
  const user = await User.findOne({ username: username })
    .sort([["username", "ascending"]])
    .exec();
  if (user && (await compare(password, user.password))) {
    const token = jwt.sign({ sub: user._id }, jwtSecret());
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    // Return an object with username and token, not just token, although: TODO refactor frontend to receive just token
    return {
      ...userWithoutPassword,
      token
    };
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
