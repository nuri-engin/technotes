const jwt = require('express-jwt');
const db = require('_helpers/db');

module.exports = authorize;

/**
 * Authorize Middleware
 * 
 * The authorize middleware can be added to any route to restrict access to the route to authenticated users with specified roles. If the roles parameter is omitted (i.e. authorize()) then the route will be accessible to all authenticated users regardless of role. It is used by the accounts controller to restrict access to account CRUD routes and revoke token route.
 * 
 * The authorize function returns an array containing two middleware functions:
 *  - The first (jwt({ ... })) authenticates the request by validating the JWT access token in the "Authorization" header of the http request. On successful authentication a user object is attached to the req object that contains the data from the JWT token, which in this example includes the user id (req.user.id).
 *  - The second authorizes the request by checking that the authenticated account still exists and is authorized to access the requested route based on its role. The second middleware function also attaches the role property and the ownsToken method to the req.user object so they can be accessed by controller functions.
 * 
 * If either authentication or authorization fails then a 401 Unauthorized response is returned.
 * 
 * @param {*} roles array
 * @returns 
 */
function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret: process.env.secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            const account = await db.Account.findById(req.user.id);
            const refreshTokens = await db.RefreshToken.find({ account: account.id });

            if (!account || (roles.length && !roles.includes(account.role))) {
                // account no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            req.user.role = account.role;
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}