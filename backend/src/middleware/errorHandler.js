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
        response.message = `Conflict: O înregistrare similară există deja.`;
        response.suggestion = 'suggest_unique';
        response.resolutionHint = 'Verifică dacă numărul matricol sau emailul nu au fost deja introduse în sistem.';
        break;
      case '23503': // foreign_key_violation
        statusCode = 400;
        response.code = 'FOREIGN_KEY_VIOLATION';
        response.message = 'Referință invalidă.';
        response.suggestion = 'suggest_fk';
        response.resolutionHint = 'Asigură-te că entitatea selectată (ex: Plan, Grupă) este încă activă.';
        break;
      case '23514': // check_violation
        statusCode = 400;
        response.code = 'CHECK_VIOLATION';
        response.message = 'Valoare în afara limitelor permise.';
        response.suggestion = 'suggest_grade_range';
        response.resolutionHint = 'Notele trebuie să fie între 1 și 10. Valoarea 0 reprezintă "Absent".';
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
