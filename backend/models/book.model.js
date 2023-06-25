const mongoose = require("mongoose");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: String,
    text: String,
    genre: String,
    img: {
      data: String,
      contentType: String,
    },
    content: Object,
    userID: String,
    views: Number,
    savedArray: Array,
    reviews: Array,
    contentParts: Array
  })
);

module.exports = Book;
