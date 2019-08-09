/* jshint esversion: 8 */

module.exports = class NotFoundError extends Error {
  get status () {
    return 404;
  }
};
