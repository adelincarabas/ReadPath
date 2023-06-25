const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/authentication.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  app.post("/api/auth/sendBook", controller.sendBook);

  app.get("/api/auth/getUserBooks", controller.getUserBooks);

  app.get("/api/searchResult", controller.searchResult);
  
  app.get("/api/searchTag", controller.searchResultTag);

  app.post("/api/views", controller.views);

  app.get("/api/last2Books", controller.last2Books);

  app.post("/api/savedBooks", controller.savedBooks);

  app.post("/api/unsavedBooks", controller.unsavedBooks);

  app.post("/api/isBookSaved", controller.isBookSaved);

  app.post("/api/my-books", controller.my_books);

  app.get("/api/popularBooks", controller.popularBooks);

  app.post("/api/postReview", controller.postReview);

  app.post("/api/getReviews", controller.getReviews);

  app.post("/api/getCustomUserData", controller.getCustomUserData);

  app.get("/api/getFollowers", controller.getFollowers);

  app.get("/api/followSomeone", controller.followSomeone);

  app.get("/api/unfollowSomeone", controller.unfollowSomeone);

  app.get("/api/isFollowing", controller.isFollowing);

  app.post("/api/editBook", controller.editBook);

  app.post("/api/getBookByTitle", controller.getBookByTitle);

  app.get("/api/getXPData", controller.getXPData);

  app.get("/api/nextPart", controller.nextPart);

  app.get("/api/getWhatPage", controller.getWhatPage);
};
