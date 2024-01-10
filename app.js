const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const errorController = require("./controllers/error");
const { mongoConnect } = require("./util/database");

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
  User.findById("659e2fc0c989c51317273eaa")
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

mongoConnect(() => {
  app.listen(PORT);
});
