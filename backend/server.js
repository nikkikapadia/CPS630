// TO DO: 
// Uploading images to firebase bucket 
//     - modify all ad mongoose models
//     - make folder structure in firebase bucket when uploading: itemPhotos/itemID
// Pagination for ad GET requests: https://plainenglish.io/blog/simple-pagination-with-node-js-mongoose-and-express
// Return more precise error codes https://www.restapitutorial.com/httpstatuscodes.html
// Protect POST, PUT, DELETE routes (validating credentials of logged in user, session key, etc.)

require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());

const User = require('./models/UserModel');
const ItemWanted = require('./models/ItemWantedModel');
const ItemForSale = require('./models/ItemForSaleModel');
const AcademicService = require('./models/AcademicServiceModel');
const Chat = require('./models/ChatModel');

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log('Server started on port 5000'));
})
.catch(error => {
    console.log(error);
});

app.get('/api/test', (req, res) => {
    res.status(200).json({ 'test': 'test' });
});

app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

app.post('/api/users/new', async(req, res) => {
    const { username, isAdmin, email, fullName } = req.body;
    try {
        const user = await User.create({ username, isAdmin, email, fullName });
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

app.put('/api/users/update/:username', async(req, res) => {
    const username = req.params.username;
    const body = req.body;
    try {
        const user = await User.findOneAndUpdate({ username: username }, { body })
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

app.delete('/api/users/delete/:username'), async(req, res) => {
    const username = req.params.username;
    try {
        const user = await User.find({ username: username }).remove();
        res.status(200).json(user);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
}

const validCategory = string => string == 'academicServices' || string == 'itemsForSale' || string == 'itemsWanted';
const categoryModelMap = { 'academicServices': AcademicService, 'itemsForSale': ItemForSale, 'itemsWanted': ItemWanted };

app.get('/api/ads/:category/', async(req, res) => {
    if (!validCategory(req.params.category))
        res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    AdModel = categoryModelMap[req.params.category];
    const ads = await AdModel.find();
    res.status(200).json(ads);
});

app.get('/api/ads/:category/:id', async(req, res) => {
    if (!validCategory(req.params.category))
        res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    AdModel = categoryModelMap[req.params.category];
    const ads = await AdModel.find({ _id: id });
    res.status(200).json(ads);
});

app.get('/api/ads/:category/:id', async(req, res) => {
    if (!validCategory(req.params.category))
        res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    AdModel = categoryModelMap[req.params.category];
    const ads = await AdModel.find({ _id: id });
    res.status(200).json(ads);
});

app.get('/api/ads/:category/:postedByUsername/:adName', async(req, res) => {
    if (!validCategory(req.params.category))
        res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    AdModel = categoryModelMap[req.params.category];
    try {
        const ads = await AdModel.find({ postedBy: req.params.postedByUsername, name: req.params.adName });
        res.status(200).json(ads);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

app.put('/api/ads/new/:category', async(req, res) => {
    if (!validCategory(req.params.category))
        res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    AdModel = categoryModelMap[req.params.category];
    try {
        const ad = await AdModel.create(req.body);
        res.status(200).json(ad);
    }
    catch(error) {
        res.status(400).json({error: error.message});
    }
});

app.post('/api/ads/:category/:id', async(req, res) => {
    if (!validCategory(req.params.category))
        res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    
});

app.delete('/api/ads/delete/:category/:id', async(req, res) => {
    if (!validCategory(req.params.category))
        res.status(400).json({error: "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'."});

    
});

app.get('/api/chats', async(req, res) => {
    const chats = await Chat.find();
    res.status(200).json(chats);
});

app.post('/api/chats/new', async(req, res) => {

});

app.put('/api/chats/newmessage/:user1/:user2', async(req, res) => {

});

app.delete('/api/chats/delete/:id', async(req, res) => {

});