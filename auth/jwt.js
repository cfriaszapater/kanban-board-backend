const expressJwt = require("express-jwt");

module.exports.jwt = jwt;
module.exports.jwtSecret = jwtSecret;

function jwt() {
  const secret = jwtSecret();
  return expressJwt({ secret }).unless({
    path: [
      // public routes that don't require authentication
      { url: "/users/token", methods: ["POST"] },
      { url: "/users", methods: ["POST"] }
    ]
  });
}

function jwtSecret() {
  var devSecret = "development-secret";
  return process.env.JWT_SECRET || devSecret;
}
