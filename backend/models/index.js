const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.book = require("./book.model");
db.genre = require("./genre.model");

db.ROLES = ["user", "admin", "moderator"];
db.GENRES = ["Action", "Horror", "etc"];

module.exports = db;
