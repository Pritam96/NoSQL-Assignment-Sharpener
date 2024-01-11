const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const User = require("./models/user");

dotenv.config({ path: "./config/config.env" });

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findOne({ name: "Pritam" })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    // Creating a user if user 'Pritam' is not available
    User.findOne({ name: "Pritam" })
      .then((user) => {
        if (!user) {
          return User.create({
            name: "Pritam",
            email: "pritam@example.com",
            cart: { items: [] },
          });
        }
      })
      .then((result) => {
        console.log("MongoDB Connected!");
        app.listen(PORT, console.log("Server is running on port:", PORT));
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => {
    console.log(err);
    process.exit(0);
  });
