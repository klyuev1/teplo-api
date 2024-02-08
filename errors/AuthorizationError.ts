class AuthorizationError extends Error {
  statusCode = 401;
  constructor(message: string) {
    super(message);
  }
}

export default AuthorizationError;
