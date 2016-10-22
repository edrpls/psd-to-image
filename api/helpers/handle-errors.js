var logger  = require('./logger');

/* Conceals the details of the error only for system errors and provides a
 * unique report ID for the user.
 * We can later use that id to debug the API
 * */

module.exports = function (err, req, res, next) {
    var uniqueId = Math.random().toString(36).substr(2, 10),
        statusCode = err.status || 500,
        publicMessage;
    if (statusCode >= 500) {
        publicMessage = 'Internal server error. ID: ' + uniqueId;
        err.message += ' | ID: ' + uniqueId;
        logger.error(err);
        return res.status(statusCode).send(publicMessage || err.message);
    }
    return res.status(statusCode).json({error: err.message});
};
