const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    message: String,
    creatorId: String,
    creatorName: String,
    category: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },
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
module.exports = mongoose.model('PostMessage', schema);