const bcrypt = require("bcryptjs");

exports.hash = async function hash(password) {
  const salt = await saltAsync();
  return await hashAsync(password, salt);
};

// Promisify (wrap old-style callback function)
function saltAsync() {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, function(err, data) {
      if (err !== null) reject(err);
      else resolve(data);
    });
  });
}

// Promisify (wrap old-style callback function)
function hashAsync(password, salt) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(password, salt, function(err, data) {
      if (err !== null) reject(err);
      else resolve(data);
    });
  });
}

exports.compare = async function compare(password, hash) {
  return bcrypt.compare(password, hash);
};
