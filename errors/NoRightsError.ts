class NoRightsError extends Error {
  statusCode = 403;
  constructor(message: string,) {
    super(message);
  }
}

export default NoRightsError;
