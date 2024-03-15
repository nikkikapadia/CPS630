const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    fullName: {
        type: String,
        required: true,
    }
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema, 'Users');