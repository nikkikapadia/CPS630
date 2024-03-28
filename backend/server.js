require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const middleware = require('./middleware');
const cors = require('cors');

const app = express();

const unless = (paths, middleware) => {
    return function(req, res, next) {
        if (paths.some(path => path.test(req.path) == true))
            return next();
        else
            return middleware(req, res, next);
    };
};

app.use(express.json());
app.use(cors());
app.use(unless([/^\/api\/users\/new$/g, /^\/api\/ads\/get\//g], middleware.decodeToken));

app.set('case sensitive routing', true);

const User = require('./models/UserModel');
const ItemWanted = require('./models/ItemWantedModel');
const ItemForSale = require('./models/ItemForSaleModel');
const AcademicService = require('./models/AcademicServiceModel');
const Chat = require('./models/ChatModel');

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
})
.catch(error => {
    console.log(error);
});


// GET user by id
app.get('/api/users/get/id/:id', async(req, res) => {
    try {
        const user = await User.find({ _id: req.params.id });
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// GET user by email
app.get('/api/users/get/email/:email', async(req, res) => {
    try {
        const user = await User.find({ email: req.params.email });
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// GET user by username
app.get('/api/users/get/username/:username', async(req, res) => {
    try {
        const user = await User.find({ username: req.params.username });
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// GET all users
app.get('/api/users/get', async (req, res) => {
    // verify user is admin
    const result = await User.findOne({ email: req.requestingUser.email }).select('isAdmin');
    const isAdmin = result.isAdmin;
    if (isAdmin == null)
        return res.status(400).json({error: 'Can not find user in database to validate credentials'});
    else if (isAdmin == false) 
        return res.status(400).json({error: 'User not authorized to make this request'});

    try {
        const users = await User.find().sort({ username: 'asc' });
        res.status(200).json(users);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// POST (create) a new user
app.post('/api/users/new', async(req, res) => {
    const { username, email, fullName } = req.body;
    try {
        const user = await User.create({ username: username, email: email, fullName: fullName });
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// PATCH (update) a user by username
app.patch('/api/users/update/username/:username', async(req, res) => {
    // verify user is admin
    const result = await User.findOne({ email: req.requestingUser.email }).select(['isAdmin', 'username']);
    const isAdmin = result.isAdmin;
    if (isAdmin == null)
        return res.status(400).json({error: 'Can not find user in database to validate credentials'});
    // if user not admin, check if they are updating their own info
    else if (isAdmin == false && req.params.username != result.username)
        return res.status(400).json({error: 'User not admin or not authorized to make this request'});

    // only admin request can make another user admin
    let body = req.body;
    if (!isAdmin && body.isAdmin)
        body.isAdmin = false;

    try {
        const user = await User.findOneAndUpdate({ username: req.params.username }, body, { new: true });
        user != null ? res.status(200).json(user) : res.status(400).json({error: 'No user found with that username'});
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// PATCH (update) a user by email
app.patch('/api/users/update/email/:email', async(req, res) => {
    // verify user is admin
    const result = await User.findOne({ email: req.requestingUser.email }).select(['isAdmin', 'username']);
    const isAdmin = result.isAdmin;
    if (isAdmin == null)
        return res.status(400).json({error: 'Can not find user in database to validate credentials'});
    // if user not admin, check if they are updating their own info
    else if (isAdmin == false && req.params.username != result.username)
        return res.status(400).json({error: 'User not admin or not authorized to make this request'});

    // only admin request can make another user admin
    let body = req.body;
    if (!isAdmin && body.isAdmin)
        body.isAdmin = false;
    
    try {
        const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
        user != null ? res.status(200).json(user) : res.status(400).json({error: 'No user found with that username'});
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// DELETE a user by username
app.delete('/api/users/delete/username/:username', async(req, res) => {
    // verify user is admin
    const result = await User.findOne({ email: req.requestingUser.email }).select(['isAdmin', 'username']);
    const isAdmin = result.isAdmin;
    if (isAdmin == null)
        return res.status(400).json({error: 'Can not find user in database to validate credentials'});
    // if user not admin, check if they are updating their own info
    else if (isAdmin == false && req.params.username != result.username)
        return res.status(400).json({error: 'User not admin or not authorized to make this request'});

    try {
        const user = await User.deleteOne({ username: req.params.username });
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// DELETE a user by email
app.delete('/api/users/delete/email/:email', async(req, res) => {
    // verify user is admin
    const result = await User.findOne({ email: req.requestingUser.email }).select(['isAdmin', 'username']);
    const isAdmin = result.isAdmin;
    if (isAdmin == null)
        return res.status(400).json({error: 'Can not find user in database to validate credentials'});
    // if user not admin, check if they are updating their own info
    else if (isAdmin == false && req.params.username != result.username)
        return res.status(400).json({error: 'User not admin or not authorized to make this request'});

    // only admin request can make another user admin
    let body = req.body;
    if (!isAdmin && body.isAdmin)
        body.isAdmin = false;

    try {
        const user = await User.deleteOne({ email: req.params.email });
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});


const validCategory = string => string == 'academicServices' || string == 'itemsForSale' || string == 'itemsWanted';
const categoryModelMap = { 'academicServices': AcademicService, 'itemsForSale': ItemForSale, 'itemsWanted': ItemWanted };


// GET all ads under a category
app.get('/api/ads/get/:category', async(req, res) => {
    if (!validCategory(req.params.category))
        return res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    const AdModel = categoryModelMap[req.params.category];
    try {
        const ads = await AdModel.find().sort({ postDate: 'asc', title: 'asc'});
        res.status(200).json(ads);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// GET ad by category and id
app.get('/api/ads/get/:category/id/:id', async(req, res) => {
    if (!validCategory(req.params.category))
        return res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    const AdModel = categoryModelMap[req.params.category];
    try {
        const ads = await AdModel.find({ _id: req.params.id });
        res.status(200).json(ads);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// GET ads by category and author
app.get('/api/ads/get/:category/author/:author', async(req, res) => {
    if (!validCategory(req.params.category))
        return res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    const AdModel = categoryModelMap[req.params.category];
    try {
        const ads = await AdModel.find({ author: req.params.author }).sort({ postDate: 'asc', title: 'asc'});
        res.status(200).json(ads);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// POST (create) a new ad under a category
app.post('/api/ads/new/:category', async(req, res) => {
    if (!validCategory(req.params.category))
        return res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    const AdModel = categoryModelMap[req.params.category];
    try {
        const ad = await AdModel.create(req.body);
        res.status(200).json(ad);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// PATCH (update) an ad by category and id
app.patch('/api/ads/update/:category/id/:id', async(req, res) => {
    if (!validCategory(req.params.category))
        return res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    const AdModel = categoryModelMap[req.params.category];

    // verify user is admin
    const result = await User.findOne({ email: req.requestingUser.email }).select(['isAdmin', 'username']);
    const isAdmin = result.isAdmin;
    if (isAdmin == null)
        return res.status(400).json({error: 'Can not find user in database to validate credentials'});
    // if user not admin, check if they are updating their own post
    else if (isAdmin == false) {
        const ad = await AdModel.findOne({ _id: req.params.id }).select(['author']);
        if (ad != null && ad.author != result.username)
            return res.status(400).json({error: 'User not admin or not authorized to make this request on another users post'});
    }
    
    console.log(req.body);
    try {
        const ad = await AdModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        ad != null ? res.status(200).json(ad) : res.status(400).json({error: 'No ad found with that id'});
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// DELETE an ad by under a category by id
app.delete('/api/ads/delete/:category/id/:id', async(req, res) => {
    if (!validCategory(req.params.category))
        return res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    const AdModel = categoryModelMap[req.params.category];

    // verify user is admin
    const result = await User.findOne({ email: req.requestingUser.email }).select(['isAdmin', 'username']);
    const isAdmin = result.isAdmin;
    if (isAdmin == null)
        return res.status(400).json({error: 'Can not find user in database to validate credentials'});
    // if user not admin, check if they are deleting their own post
    else if (isAdmin == false) {
        const ad = await AdModel.findOne({ _id: req.params.id }).select(['author']);
        if (ad != null && ad.author != result.username)
            return res.status(400).json({error: 'User not admin or not authorized to make this request on another users post'});
    }

    try {
        const ad = await AdModel.deleteOne({ _id: req.params.id });
        res.status(200).json(ad);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// GET all chats with usernames of user1 and user2 (does not matter which order they are input)
app.get('/api/chats/get/:user1/:user2', async(req, res) => {
    try {
        const chat = await Chat.findOne({
            $or: [
                {
                    $and: [
                        { user1 : req.params.user1 },
                        { user2: req.params.user2 }
                    ]
                },
                {
                    $and: [
                        { user1: req.params.user2 },
                        { user2: req.params.user1 }
                    ]
                }
            ]
        }).select(['messages']);
        res.status(200).json(chat.messages);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// GET all people user has a chat with (returns both usernames)
app.get('/api/chats/get/:username', async(req, res) => {
    try {
        const chats = await Chat.find({
            $or: [
                { user1 : req.params.username },
                { user2: req.params.username } 
            ]
        }).select(['user1', 'user2']);
        res.status(200).json(chats);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// POST (create) a new chat
app.post('/api/chats/new/', async(req, res) => {
    try {
        const chat = await Chat.create(req.body);
        res.status(200).json(chat);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// PATCH (update) a chat with a new message
app.patch('/api/chats/newmessage/:user1/:user2', async(req, res) => {
    const message = req.body.messages[0];
    try {
        const chat = await Chat.findOneAndUpdate({
            $or: [
                {
                    $and: [
                        { user1 : req.params.user1 },
                        { user2: req.params.user2 }
                    ]
                },
                {
                    $and: [
                        { user1: req.params.user2 },
                        { user2: req.params.user1 }
                    ]
                }
            ]
        }, {
            $push: {
                messages: message
            }
        }, 
        { new: true });
        res.status(200).json(message);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

// DELETE a chat with (usernames) user1 and user2 (interchangable)
app.delete('/api/chats/delete/:user1/:user2', async(req, res) => {
    try {
        const chat = await Chat.deleteOne({
            $or: [
                {
                    $and: [
                        { user1 : req.params.user1 },
                        { user2: req.params.user2 }
                    ]
                },
                {
                    $and: [
                        { user1: req.params.user2 },
                        { user2: req.params.user1 }
                    ]
                }
            ]
        });
        res.status(200).json(chat);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});


