require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');

const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const accountRoutes = require('./routes/accountRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const dishRoutes = require('./routes/dishRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
// Database connection
mongoose.connect(process.env.MONGO_URI, {  })
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

// Passport configuration
app.use(session({ 
  secret: 'secret', 
  resave: false, 
  saveUninitialized: true }
));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success') || [];
  res.locals.error = req.flash('error') || [];
  next();
});
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Routes
app.use(authRoutes);
app.use('/dishes', dishRoutes);
app.use('/events', eventRoutes);
app.use('/account', accountRoutes);
app.use('/password', passwordRoutes);

app.get('/', (req, res) => {
  res.render('layout', { 
    cssFile: 'home.css',
    title: 'CrowdCater',
    view: 'home/index'
  });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log('Server running on port: ', process.env.PORT);
});
