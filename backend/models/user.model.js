const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    savedBooksArray: Array,
    followers: Array,
    following: Array,
    xp: Array,
    bookParts: Array,
    dailyRead: Number,
  })
);

module.exports = User;
