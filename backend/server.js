require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

const User = require("./models/UserModel");
const ItemWanted = require("./models/ItemWantedModel");
const ItemForSale = require("./models/ItemForSaleModel");
const AcademicService = require("./models/AcademicServiceModel");
const Chat = require("./models/ChatModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`Server started on port ${process.env.PORT}`)
    );
  })
  .catch((error) => {
    console.log(error);
  });

// GET all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST (create) a new user
app.post("/api/users/new", async (req, res) => {
  const { username, isAdmin, email, fullName } = req.body;
  try {
    const user = await User.create({ username, isAdmin, email, fullName });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH (update) a user by username
app.patch("/api/users/update/:username", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true }
    );
    user != null
      ? res.status(200).json(user)
      : res.status(400).json({ error: "No user found with that username" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a user by username
app.delete("/api/users/delete/:username", async (req, res) => {
  try {
    const user = await User.deleteOne({ username: req.params.username });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const validCategory = (string) =>
  string == "academicServices" ||
  string == "itemsForSale" ||
  string == "itemsWanted";
const categoryModelMap = {
  academicServices: AcademicService,
  itemsForSale: ItemForSale,
  itemsWanted: ItemWanted,
};

// GET all under a category
app.get("/api/ads/:category", async (req, res) => {
  if (!validCategory(req.params.category))
    return res
      .status(400)
      .json({
        error:
          "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'.",
      });

  const AdModel = categoryModelMap[req.params.category];
  try {
    const ads = await AdModel.find();
    res.status(200).json(ads);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET ad by category and id
app.get("/api/ads/:category/:id", async (req, res) => {
  if (!validCategory(req.params.category))
    return res
      .status(400)
      .json({
        error:
          "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'.",
      });

  const AdModel = categoryModelMap[req.params.category];
  try {
    const ads = await AdModel.find({ _id: req.params.id });
    res.status(200).json(ads);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET ads by category and author
app.get("/api/ads/:category/:author", async (req, res) => {
  if (!validCategory(req.params.category))
    return res
      .status(400)
      .json({
        error:
          "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'.",
      });

  const AdModel = categoryModelMap[req.params.category];
  try {
    const ads = await AdModel.find({ author: req.params.author });
    res.status(200).json(ads);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST (create) a new ad under a category
app.post("/api/ads/new/:category", async (req, res) => {
  if (!validCategory(req.params.category))
    return res
      .status(400)
      .json({
        error:
          "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'.",
      });

  const AdModel = categoryModelMap[req.params.category];
  try {
    const ad = await AdModel.create(req.body);
    res.status(200).json(ad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH (update) an ad by category and id
app.patch("/api/ads/:category/:id", async (req, res) => {
  if (!validCategory(req.params.category))
    return res
      .status(400)
      .json({
        error:
          "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'.",
      });

  const AdModel = categoryModelMap[req.params.category];
  try {
    const ad = await AdModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    ad != null
      ? res.status(200).json(ad)
      : res.status(400).json({ error: "No ad found with that id" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE an ad by under a category by id
app.delete("/api/ads/delete/:category/:id", async (req, res) => {
  if (!validCategory(req.params.category))
    return res
      .status(400)
      .json({
        error:
          "Invalid ad category. Category must be 'academicService', 'itemsForSale', or 'itemsWanted'.",
      });

  const AdModel = categoryModelMap[req.params.category];
  try {
    const ad = await AdModel.deleteOne({ _id: req.params.id });
    res.status(200).json(ad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
