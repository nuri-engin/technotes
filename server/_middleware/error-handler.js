module.exports = errorHandler;

/** 
 * Global Error Handler Middleware
 * 
 * The global error handler is used catch all errors and remove the need for duplicated error handling code throughout the boilerplate application. 
 * It's configured as middleware in the main server.js file.
 * 
 * By convention errors of type 'string' are treated as custom (app specific) errors, this simplifies the code for throwing custom errors 
 * since only a string needs to be thrown (e.g. throw 'Invalid token'). Further to this if a custom error ends with the words 
 * 'not found' a 404 response code is returned, otherwise a standard 400 response is returned. 
 * 
 * See the account service for some examples of custom errors thrown by the api, errors are caught in the accounts controller for each route and 
 * passed to next(err) which passes them to this global error handler.
 */
function errorHandler(err, req, res, next) {
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.name === 'ValidationError':
            // mongoose validation error
            return res.status(400).json({ message: err.message });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            return res.status(401).json({ message: 'Unauthorized' });
        default:
            return res.status(500).json({ message: err.message });
    }
}