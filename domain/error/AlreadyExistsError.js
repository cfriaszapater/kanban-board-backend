class AlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "AlreadyExistsError";
  }
}
exports.AlreadyExistsError = AlreadyExistsError;
