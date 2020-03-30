const { BadRequestError } = require("../domain/error/BadRequestError");
const { AlreadyExistsError } = require("../domain/error/AlreadyExistsError");
const { NotFoundError } = require("../domain/error/NotFoundError");
const { ForbiddenError } = require("../domain/error/ForbiddenError");
const log = require("bunyan").createLogger({ name: "kanban-board-backend" });

function handleError(err) {
  const responseBody = { message: err.message };
  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return { status: 401, responseBody: { message: "Invalid Token" } };
  }
  if (err instanceof ForbiddenError) {
    return { status: 401, responseBody };
  }
  if (err instanceof NotFoundError) {
    return { status: 404, responseBody };
  }
  if (err instanceof AlreadyExistsError) {
    return { status: 409, responseBody };
  }
  if (err instanceof BadRequestError) {
    return { status: 400, responseBody };
  }
  log.error(err);
  return { status: 500, responseBody };
}

exports.handleError = handleError;
