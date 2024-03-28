const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
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
});

const chatSchema = new mongoose.Schema({
    user1: {
        type: String,
        required: true,
    },
    user2: {
        type: String,
        required: true,
    },
    messages: [{
        type: [messageSchema],
    }]
});

module.exports = mongoose.model('Chat', chatSchema, 'Chats');