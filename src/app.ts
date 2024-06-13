import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';

import { get404 } from './controllers/error';
import sequelize from './util/database';
import Product from './models/product';
import User from './models/user';
import Cart from './models/cart';
import CartItem from './models/cart-item';
import Order from './models/order';
import OrderItem from './models/order-item';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

// Defining One-To-Many relationship between Product and User
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// Defining One-To-One relationship between User and Cart
User.hasOne(Cart); // This will add a user key to the cart
Cart.belongsTo(User); // this is the inverse relation to the User.hasOne(Cart) and its optional

// Defining Many-To-Many relationship between Cart and Product
Cart.belongsToMany(Product, { through: CartItem }); // We tell sequelize where these connections should be stored
Product.belongsToMany(Cart, { through: CartItem }); // We tell sequelize where these connections should be stored

// Creating relationships to the order table:
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true }) // Take care when using that, it DROPS ALL THE TABLES
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: 'Rodrigo', email: 'test@test.com' });
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
