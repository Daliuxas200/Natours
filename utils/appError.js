class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // our own property to check later if its our error or some internal error, to filter what to send;
    this.isOperational = true;

    // does not polute our stack tree ? what ?
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
