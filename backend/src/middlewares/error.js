export function notFound(req, res, next) {
  res.status(404);
  next(new Error('Not Found'));
}

export function errorHandler(err, req, res, next) {
  console.error('Error Handler Caught:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
  });
}
