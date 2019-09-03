const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../auth/jwt");

// TODO users hardcoded for simplicity, store in a db for production applications
const users = [
  {
    id: 1,
    username: "test",
    password: "test",
    firstName: "Test",
    lastName: "User"
  },
  {
    id: 2,
    username: "jarl",
    password: "jarl",
    firstName: "JARL",
    lastName: "CONDEMOR"
  }
];

module.exports = {
  authenticate
};

async function authenticate({ username, password }) {
  const user = users.find(
    u => u.username === username && u.password === password
  );
  if (user) {
    const token = jwt.sign({ sub: user.id }, jwtSecret());
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token
    };
  }
}
