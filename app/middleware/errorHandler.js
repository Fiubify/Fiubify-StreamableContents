const apiError = require('../errors/apiError');

function errorHandler(err, req, res, _next) {
  if (err instanceof apiError) {
    res.status(err.code).json(err.toJson());
    return;
  }

  res.status(500).json({ error: { msg: 'Internal error' } });
}

module.exports = errorHandler;
