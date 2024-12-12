require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI, {  })
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

// Passport configuration
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success') || [];
  res.locals.error = req.flash('error') || [];
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.use(userRoutes);
app.use('/items', itemRoutes);

app.get('/', (req, res) => {
    res.render('home/');
  });
  

// Start server
app.listen(3003, () => {
  console.log('Server running on http://localhost:3003');
});
