const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorControler = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorControler.get404);

// Defining One-To-Many relationship between Product and User
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

// Defining One-To-One relationship between User and Cart
User.hasOne(Cart); // This will add a user key to the cart
Cart.belongsTo(User); // this is the inverse relation to the User.hasOne(Cart) and its optional

// Defining Many-To-Many relationship between Cart and Product
Cart.belongsToMany(Product, { through: CartItem }); // We tell sequelize where these connections should be stored
Product.belongsToMany(Cart, { through: CartItem }); // We tell sequelize where these connections should be stored

sequelize
  // .sync({ force: true }) // Take care when using that, it DROPS ALL THE TABLES
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Rodrigo", email: "test@test.com" });
    }
    // return Promise.resolve(user);
    // Technically you can omit that Promise.resolve() because if you return a value
    // in a "then block" it is automatically wrapped into a new promise.
    return user;
  })
  .then((user) => {
    return user
      .getCart()
      .then((cart) => {
        if (!cart) {
          return user.createCart();
        } else {
          return Promise.resolve(cart);
        }
      })
      .catch((err) => console.log(err));
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
