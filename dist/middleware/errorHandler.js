"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorMessages;
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errorMessages = Object.values(err).map((error) => ({
            path: error.path,
            message: error.message,
        }));
    }
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Cast Error';
    }
    else if (err.name === 'DuplicateEntry') {
        statusCode = 400;
        message = 'Duplicate Entry';
        errorMessages = [
            {
                path: '',
                message: err.message,
            },
        ];
    }
    const errorResponse = {
        success: false,
        message,
        errorMessages,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    };
    res.status(statusCode).json(errorResponse);
};
exports.default = errorHandler;
