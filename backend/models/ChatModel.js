const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: [{
        user1: {
            type: String,
            required: true,
        },
        user2: {
            type: String,
            required: true,
        }
    }],
    messages: [{
        sender: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
    }]
});

module.exports = mongoose.model('Chat', chatSchema, 'Chats');