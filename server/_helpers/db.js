const mongoose = require('mongoose');

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(process.env.MONGODB_URI || process.env.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

/**
 * Mongo Database Wrapper
 * 
 * The MongoDB wrapper connects to MongoDB using Mongoose and exports an object containing all of the database model objects in the boilerplate application. 
 * It provides an easy way to access any part of the database from a single point.
 * 
 * It also contains the isValidId() utility function to enable checking if an id is a valid Mongo ObjectId before attempting to run a query.
 */
module.exports = {
    Comments: require('comments/comment.model'),
    PostMessage: require('posts/post.model'),
    PostCategories: require('posts/categories.model'),
    Account: require('accounts/account.model'),
    RefreshToken: require('accounts/refresh-token.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}