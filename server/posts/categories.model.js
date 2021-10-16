const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    value: {
        type: String,
        required: true,
        unique: true
    }, 
    subs: [],
    updatedAt: Date,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

schema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false
});

/**
 * Mongoose Post Model 
 */
module.exports = mongoose.model('PostCategories', schema);