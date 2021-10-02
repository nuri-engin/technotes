const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        required: true,
        lowercase: true
    },
    passwordHash: { type: String, required: true },
    userName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    acceptTerms: Boolean,
    role: { type: String },
    verificationToken: String,
    verified: Date,
    resetToken: {
        token: String,
        expires: Date
    },
    passwordReset: Date,
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

/**
 * Mongoose Account Model
 * 
 * The account model uses Mongoose to define the schema for the accounts collection in the MongoDB database. 
 * The exported Mongoose model object gives full access to perform CRUD (create, read, update, delete) operations on accounts in MongoDB, 
 * see the account service below for examples of it being used (via the db helper).
 * 
 * The schema defines the properties in MongoDB for account records, the virtual properties are convenience properties available on the mongoose model that 
 * don't get persisted to MongoDB.schema.set('toJSON', { ... }); configures which account properties are included when converting MongoDB records to JSON objects:
 *  - virtuals: true includes the Mongoose virtual id property which is a copy of the MongoDB _id property.
 *  - versionKey: false excludes the Mongoose version key (__v).
 *  - transform: function (doc, ret) { ... } removes the MongoDB _id and passwordHash properties when converting records to JSON.
 */
module.exports = mongoose.model('Account', schema);