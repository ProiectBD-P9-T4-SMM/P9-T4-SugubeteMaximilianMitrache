const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  let statusCode = 500;
  let response = {
    error: true,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
    resolutionHint: 'Please contact the system administrator.'
  };

  // Handle specific PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        statusCode = 409;
        response.code = 'UNIQUE_VIOLATION';
        response.message = `A record with this value already exists.`;
        response.resolutionHint = 'Please choose a different, unique value.';
        break;
      case '23503': // foreign_key_violation
        statusCode = 400;
        response.code = 'FOREIGN_KEY_VIOLATION';
        response.message = 'The operation references a record that does not exist.';
        response.resolutionHint = 'Ensure the selected options from dropdowns are valid.';
        break;
      case '23514': // check_violation
        statusCode = 400;
        response.code = 'CHECK_VIOLATION';
        response.message = 'The provided value violates a constraint.';
        response.resolutionHint = 'Ensure the value (e.g., grade) is within the allowed bounds (e.g., between 1 and 10).';
        break;
      default:
        // Other DB errors
        statusCode = 500;
        response.code = `DB_ERROR_${err.code}`;
        response.message = 'Database operation failed.';
    }
  }

  // Handle custom application errors
  if (err.status) {
    statusCode = err.status;
    response.code = err.customCode || 'APP_ERROR';
    response.message = err.customMessage || err.message;
    if (err.resolutionHint) response.resolutionHint = err.resolutionHint;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
