const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },
    creatorName: String,
    category: String,
    selectedFile: String,
    tags: {
        type: [String],
        default: []
    },
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