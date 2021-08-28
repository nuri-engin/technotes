const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    postmessage_id: String,
    creator: String,
    message: String,
    updated: Date,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false
});

/**
 * Mongoose Comment Model 
 */
module.exports = mongoose.model('Comments', schema);