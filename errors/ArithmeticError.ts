class ArithmeticError extends Error {
  statusCode = 409;
  constructor(message: string) {
    super(message);
  }
}

export default ArithmeticError;
