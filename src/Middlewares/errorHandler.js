//errorHandler
/** 
class ErrorResponse extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = `Resource not found with id of ${err.value}`;
      error = new ErrorResponse(message, 404);
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      error = new ErrorResponse(messages.join(', '), 400);
    }
  
    // Mongoose duplicate key
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue);
      const message = `Duplicate field value entered for ${field}`;
      error = new ErrorResponse(message, 400);
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  };
  
  module.exports = { ErrorResponse, errorHandler };
  
  **/
  
  
  
  
  