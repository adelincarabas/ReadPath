const config = require("../dbconfig/auth.config");
const db = require("../models");
const cheerio = require('cheerio');
const User = db.user;
const Role = db.role;
const Book = db.book;
const cron = require("node-cron");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    xp: [1, 0, 100],
    dailyRead: 0
  });

  let usernameExists = await User.findOne({ username: req.body.username });
  let emailExists = await User.findOne({ email: req.body.email });

  if (usernameExists) {
    res.send({ message: "Failed! Username is already in use!" });
    return;
  }

  if (emailExists) {
    res.send({ message: "Failed! Email is already in use!!" });
    return;
  }

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        res.status(401).send({ message: "User Not found." });
        return;
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        res.status(401).send({ message: "Invalid Password!" });
        return;
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      res.status(200).send({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token: token,
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

function splitHtmlIntoChunks(html, wordCount = 400) {
  const words = html.split(' ');
  const chunks = [];
  const openTags = [];

  for (let i = 0; i < words.length; i += wordCount) {
    let chunk = words.slice(i, i + wordCount).join(' ');

    const chunkOpenTags = chunk.match(/<([a-zA-Z0-9]+)(?![a-zA-Z0-9/>])/g) || [];
    const chunkCloseTags = chunk.match(/<\/([a-zA-Z0-9]+)>/g) || [];
    let chunkOpenTagsNormalized = chunkOpenTags.map(tag => tag.slice(1));
    let chunkCloseTagsNormalized = chunkCloseTags.map(tag => tag.slice(2, tag.length-1));

    for (let j = 0; j < chunkOpenTagsNormalized.length; j++) {
      const index = chunkCloseTagsNormalized.indexOf(chunkOpenTagsNormalized[j]);

      if (index !== -1) {
        chunkOpenTagsNormalized.splice(j, 1);
        chunkCloseTagsNormalized.splice(index, 1);
      }
    }
    for (let k = 0; k < openTags.length; k++) {
      chunk = `${openTags[k]} ${chunk}`;
    }

    openTags.length = 0;
    chunkOpenTagsNormalized.forEach(tag => openTags.unshift(`<${tag}`)); // we use unshift because we want to maintain the order for nested tags

    for (let m = 0; m < openTags.length; m++) {
      const closeTag = openTags[m].replace('<', '</') + '>';
      chunk = `${chunk} ${closeTag}`;
    }
    chunks.push(chunk);
  }

  return chunks;
}

exports.sendBook = async (req, res) => {
  let splttedHtml  = splitHtmlIntoChunks(req.body.contentParts);
  console.log(typeof splttedHtml)

  const book = new Book({
    title: req.body.title,
    text: req.body.text,
    genre: req.body.genre,
    img: {
      data: req.body.image,
      contentType: "string",
    },
    userID: req.body.userID,
    views: 0,
    reviews: {},
    contentParts: splttedHtml
  });

  book.save((err, book) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.send({ message: "User was registered successfully!" });
  });

};

exports.editBook = async (req, res) => {
  console.log(req.body.contentParts);
  const newValues = [req.body.contentParts];

  try {
    const book = await Book.findOneAndUpdate({title: req.body.title}, { contentParts: newValues }, { new: true });

    if(book) {
      console.log("The operation was successful");
      res.status(200).send({ message: "Book updated successfully!", book });
    } else {
      console.log("No books matched the provided title");
      res.status(404).send({ message: "No books matched the provided title" });
    }
  } catch (error) {
    console.log("An error occurred:", error.message); // Log the error message
    res.status(500).send({ message: "An error occurred while updating the book: " + error.message });
  }

}

exports.getFollowers = async (req, res) => {
  const query = {
    username: req.query.userID,
  };
  const cursor = await User.findOne(query).exec();

  res.send({followers: cursor.followers, following: cursor.following});
}

exports.isFollowing = async (req, res) => {
  const query = {
    username: req.query.userID,
  };
  const cursor = await User.findOne(query).exec();

  res.send({followers: cursor.followers});
}

exports.getXPData = async (req, res) => {
  const query = {
    username: req.query.userID,
  };
  const cursor = await User.findOne(query).exec();

  res.send({xp: cursor.xp, dailyRead: cursor.dailyRead});
}

exports.getWhatPage = async (req , res) => {
  const query = {
    username: req.query.userID,
  };
  const cursor = await User.findOne(query).exec();
  let part = 0;

  if(cursor.bookParts.length){
    for(let i = 0; i < cursor.bookParts.length; i++){
      if(req.query.title == cursor.bookParts[i].title){
        part = cursor.bookParts[i].part;
      }
    }
  }

  res.send({part: part});
}

exports.nextPart = async(req, res) => {
  const query = {
    username: req.query.userID,
  };
  const cursor = await User.findOne(query).exec();

  let bookParts = cursor.bookParts;
  console.log(cursor);

  if(bookParts.length){
    for(let i = 0; i < bookParts.length; i++){
      if(bookParts[i].title == req.query.title){
        if(bookParts[i].part < parseInt(req.query.part)){
        bookParts[i].part++;
        cursor.dailyRead++;

        let xp = cursor.xp;
  if(cursor.dailyRead < 20){
    xp[1] = xp[1] + 10;

    if(xp[1] >= xp[2]){
      xp[0] = xp[0] + 1;
      xp[1] = xp[1] - xp[2];

      const baseXP = 100;
      const growthRate = 1.35;

      const calculateXPNeeded = (level) => {
        return Math.ceil(baseXP * Math.pow(growthRate, level - 1));
      };  
      
      xp[2] = calculateXPNeeded(xp[0]);
    }

    User.updateOne(query, { $set: { dailyRead: cursor.dailyRead, xp: xp } })
  .then(res => {
    if(res.nModified == 0) {
        console.log('No books were updated');
    } else {
        console.log('Update successful');
    }
  })
  .catch(err => {
      console.error('Update failed', err);
  });
  }

        }
      }else{
        const titles = bookParts.map(obj => obj.title);
        if(!titles.includes(req.query.title)){
          bookParts.push({title: req.query.title, part: 1})
          cursor.dailyRead++;

          let xp = cursor.xp;
  if(cursor.dailyRead <= 20){
    xp[1] = xp[1] + 10;

    if(xp[1] >= xp[2]){
      xp[0] = xp[0] + 1;
      xp[1] = xp[1] - xp[2];

      const baseXP = 100;
      const growthRate = 1.35;

      const calculateXPNeeded = (level) => {
        return Math.ceil(baseXP * Math.pow(growthRate, level - 1));
      };  
      
      xp[2] = calculateXPNeeded(xp[0]);
    }

    User.updateOne(query, { $set: { dailyRead: cursor.dailyRead, xp: xp } })
  .then(res => {
    if(res.nModified == 0) {
        console.log('No books were updated');
    } else {
        console.log('Update successful');
    }
  })
  .catch(err => {
      console.error('Update failed', err);
  });
  }
        }
      }
    }
  }else{
    bookParts.push({title: req.query.title, part: 1})
  }

  User.updateOne(query, { $set: { bookParts: bookParts } })
  .then(res => {
    if(res.nModified == 0) {
        console.log('No books were updated');
    } else {
        console.log('Update successful');
    }
  })
  .catch(err => {
      console.error('Update failed', err);
  });


  res.send({message: bookParts});
}

exports.followSomeone = async (req, res) => {
  let filter = { username: req.query.userID };
  let filter2 = { username: req.query.myUserID }
  let newReview = `${req.query.myUserID}`
  let newReview2 = `${req.query.userID}`

  let update = { $push: { followers: newReview } };
  let update2 = { $push: { following: newReview2 } };


  User.updateOne(filter, update, function(err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });

  User.updateOne(filter2, update2, function(err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });

  res.send({ message: "Following and Follower was added" });
}

exports.unfollowSomeone = async (req, res) => {
  let filter = { username: req.query.userID };
  let filter2 = { username: req.query.myUserID }
  let newReview = `${req.query.myUserID}`
  let newReview2 = `${req.query.userID}`

  let update = { $pull: { followers: newReview } };
  let update2 = { $pull: { following: newReview2 } };


  User.updateOne(filter, update, function(err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });

  User.updateOne(filter2, update2, function(err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });

  res.send({ message: "Following and Follower was added" });
}

exports.getCustomUserData = async (req, res) => {
  const query = {
    username: req.body.username,
  };
  const cursor = await Book.findOne(query).exec();

  res.send({username: cursor.userID})

}

exports.postReview = async (req, res) => {
  let filter = { title: req.body.params.title };
  let newReview = { reviewer: req.body.params.author, comment: req.body.params.description, rating: req.body.params.rating }; 

  let update = { $push: { reviews: newReview } };


  Book.updateOne(filter, update, function(err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  
    res.send({ message: "Review was added successfully!" });
  });
}

exports.getReviews = async (req, res) => {
  const query = {
    title: req.body.title,
  };

  const cursor = await Book.findOne(query).exec();
  let reviews = [];

  for (let i = 0; i < cursor.reviews.length; i++) {
    reviews.push({
      reviewer: cursor.reviews[i].reviewer, 
      comment: cursor.reviews[i].comment, 
      rating: cursor.reviews[i].rating
    });
  }

  res.send({ message: reviews });

}

exports.getUserBooks = async (req, res) => {
  const query = {
    userID: req.query.userID,
  };
  const cursor = await Book.find(query).exec();
  let books = [];

  for (let i = 0; i < cursor.length; i++) {
    books.push({
      username: cursor[i].userID,
      title: cursor[i].title,
      tag: cursor[i].genre,
      content: cursor[i].text,
      image: cursor[i].img,
      views: cursor[i].views,
    });
  }

  res.send({ message: books });
};

// Functions to gather search results
exports.searchResult = async (req, res) => {
  const cursor = await Book.find({
    title: { $regex: `.*${req.query.title}.*`, $options: 'i' },
  }).exec();
  let books = [];

  for (let i = 0; i < cursor.length; i++) {
    books.push({
      username: cursor[i].userID,
      title: cursor[i].title,
      tag: cursor[i].genre,
      content: cursor[i].text,
      image: cursor[i].img,
      views: cursor[i].views,
    });
  }

  res.send({ message: books });
};

exports.searchResultTag = async (req, res) => {
  const cursor = await Book.find({
    genre: { $regex: `${req.query.tag}` },
  }).exec();
  let books = [];

  for (let i = 0; i < cursor.length; i++) {
    books.push({
      username: cursor[i].userID,
      title: cursor[i].title,
      tag: cursor[i].genre,
      content: cursor[i].text,
      image: cursor[i].img,
      views: cursor[i].views,
    });
  }

  res.send({ message: books });
};
//-----

exports.views = async (req, res) => {
  await Book.updateOne(
    { title: `${req.body.title}` },
    {
      $set: {
        views: req.body.views + 1,
      },
    }
  ).exec();

  res.send({ message: "Views are skyrocketting" });
};

exports.last2Books = async (req, res) => {
  const cursor = await Book.find().exec();
  let books = [];

  for (let i = cursor.length - 1; i > 0; i--) {
    books.push({
      username: cursor[i].userID,
      title: cursor[i].title,
      tag: cursor[i].genre,
      content: cursor[i].text,
      image: cursor[i].img,
      views: cursor[i].views,
      contentParts: cursor[i].contentParts
    });
  }

  res.send({ message: books });
};

exports.savedBooks = async (req, res) => {
  await User.updateOne(
    { username: `${req.body.userID}` },
    {
      $push: {
        savedBooksArray: `${req.body.title}`,
      },
    }
  ).exec();
};

exports.getBookByTitle = async(req, res) => {
  const title = req.body.title;

  try {
    const book = await Book.findOne({title: title});

    if(book) {
      console.log("Book found:", book.contentParts);
      res.status(200).send({ message: "Book found!", contentParts: book.contentParts });
    } else {
      console.log("No books matched the provided title");
      res.status(404).send({ message: "No books matched the provided title" });
    }
  } catch (error) {
    console.log("An error occurred:", error.message);
    res.status(500).send({ message: "An error occurred while searching for the book: " + error.message });
  }
}

exports.unsavedBooks = async (req, res) => {
  await User.updateOne(
    { username: `${req.body.userID}` },
    {
      $pull: {
        subDocument: {
          savedBooksArray: req.body.title,
        },
      },
    }
  ).exec();
};

exports.isBookSaved = async (req, res) => {
  let cursor = await User.find({
    savedBooksArray: { $in: [`${req.body.title}`] },
  }).exec();

  if (cursor.length !== 0) {
    res.send({ message: true});
  } else {
    res.send({ message: false });
  }
};

exports.my_books = async (req, res) => {
  let cursor = await User.find({
    username: `${req.body.userID}`,
  }).exec();

  let books = [];

  for (let i = 0; i < cursor.length; i++) {
    books.push(cursor[i].savedBooksArray);
  }

  let cursor2 = [];
  books = books.flat(5);

  for (let i = 0; i < books.length; i++) {
    cursor2.push(
      await Book.findOne({
        title: `${books[i]}`,
      }).exec()
    );
  }

  res.send({ message: cursor2 });
};

exports.popularBooks = async (req, res) => {
  const cursor = await Book.find().sort({ views: -1 }).exec();
  let books = [];

  for (let i = 0; i < cursor.length; i++) {
    books.push({
      username: cursor[i].userID,
      title: cursor[i].title,
      tag: cursor[i].genre,
      content: cursor[i].text,
      image: cursor[i].img,
      views: cursor[i].views,
      contentParts: cursor[i].contentParts
    });
  }

  res.send({ message: books });
};

cron.schedule("0 10 * * *", function() {
  User.updateMany({}, { $set: { dailyRead: 0 } }, (err, res) => {
    if (err) {
      console.log('Error occurred during reset:', err);
    } else {
      console.log('All users daily read has reseted successfully');
    }
  });
}, {
  scheduled: true,
  timezone: "Europe/Bucharest"
});