const db = require("./backend/models");
const Role = db.role;

const express = require("express");
const cors = require("cors");
const app = express();

const dbConfig = require("./backend/dbconfig/db.config");

var corsOptions = {
  origin: "http://localhost:19006",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json({limit: '25mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '25mb', extended: true }));

db.mongoose
  .connect(
    `mongodb+srv://${dbConfig.HOST}:${dbConfig.PASSWORD}@${dbConfig.DB}.adcfv.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Story Artisans - Carabas Adelin" });
});

// routes
require("./backend/routes/login.routes")(app);
require("./backend/routes/user.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

