module.exports = validateRequest;

/**
 * Validate Request Middleware
 *
 * The validate request middleware function validates the body of a request against a Joi schema object.
 * 
 * It used by schema middleware functions in controllers to validate the request against the schema for a specific route 
 * (e.g. authenticateSchema in the accounts controller).
 * 
 * @param {*} req 
 * @param {*} next 
 * @param {*} schema 
 */
function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    
    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}