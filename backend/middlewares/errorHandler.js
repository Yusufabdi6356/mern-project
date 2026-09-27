export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON body';
  }

  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}`;
  }

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map(error => error.message).join(', ');
  }

  if (err.code === 11000) {
    status = 409;
    message = `${Object.keys(err.keyValue).join(', ')} already exists`;
  }

  if (err.name === 'MulterError') {
    status = 400;
  }

  if (status === 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') message = 'Something went wrong';
  }

  res.status(status).json({
    success: false,
    message: message || 'Something went wrong',
    status
  });
};
