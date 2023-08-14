var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let jwt = require('jsonwebtoken');
var app = express();
let cors = require('cors');
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var aboutRouter = require('../routes/about');



//gg map
const {Client} = require("@googlemaps/google-maps-services-js");
//create usermodel instance
let userModel = require("../models/user");
let User = userModel.User;
let userProfileModel = require("../models/userProfile")
let userProfile = userProfileModel.userProfile;
//database_setup
let mongoose = require("mongoose");
let DB = require("./db.js");

//modules for authentication
let session = require("express-session");
let passport = require("passport");
let passportLocal = require("passport-local");
let localStratergy = passportLocal.Strategy;
let flash = require("connect-flash");
let passportJWT = require('passport-jwt');
const product = require('../models/product');

let JWTStategy = passportJWT.Strategy;
let ExtractJwt = passportJWT.ExtractJwt;
//setup express session
app.use(
  session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false,
  })
);

//initialize flash
app.use(flash());

//intialize passport
app.use(passport.initialize());
app.use(passport.session());

//implement a user authenticaion Strategy
passport.use(User.createStrategy());
app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = 'our-google-client-id';
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

//serialize and deserialize user object info -encrypt and decrypt
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//point mongoose to the DB URI
mongoose.connect(process.env.URI || DB.URL, { useNewUrlParser: true, useUnifiedTopology: true });
let mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "connection error:"));
mongodb.once("open", () => {
  console.log("Database Connected");
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules/jquery/dist/')));
app.use(express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/')));

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = DB.Secret;

let strategy = new JWTStategy(jwtOptions,(jwt_payload,done) => {
  User.findById(jwt_payload.id)
  .then(user => {
    return done(null,user);
  })
  .catch(err =>{
    return done(err,false);
  });
  });

  passport.use(strategy);

//Set up the router
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/dashboard',(req,res,next)=>{
  res.render('dashboard', { title: 'Dashboard' , displayName: req.user ? req.user.displayName : '' })});
;
// app.get('/search',(req,res,next)=>{
//   let map;

// async function initMap() {
//   // The location of Uluru
//   const position = { lat: -25.344, lng: 131.031 };
//   // Request needed libraries.
//   //@ts-ignore
//   const { Map } = await google.maps.importLibrary("maps");
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

//   // The map, centered at Uluru
//   map = new Map(document.getElementById("map"), {
//     zoom: 4,
//     center: position,
//     mapId: "DEMO_MAP_ID",
//   });

//   // The marker, positioned at Uluru
//   const marker = new AdvancedMarkerElement({
//     map: map,
//     position: position,
//     title: "Uluru",
//   });
// }

// initMap();
// })

app.post('/dashboard', (req, res, next) => {
  let newProfile = userProfileModel({
    "userName": req.body.productName,
    "petName": req.body.petName,
    "about": req.body.aboutPet,
    "weight": req.body.weight,
    "phoneNumber": req.body.phoneNumber,
  });

  userProfileModel.create(newProfile, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/dashboard');
    }
  });
})


app.get('/bookings',(req,res,next)=>{
  res.render('bookings', { title: 'Bookings' , displayName: req.user ? req.user.displayName : '' })});
;
app.get('/petcaretaker',(req,res,next)=>
  res.render('petcaretaker', { title: 'Register as Pet CareTaker' , displayName: req.user ? req.user.displayName : '' }));
;
app.get('/rate',(req,res,next)=>{
  res.render('rate', { title: 'Rating' , displayName: req.user ? req.user.displayName : '' })});
;

app.get('/payment',(req,res,next)=>{
  res.render('paymentmethod', { title: 'Payment Method' , displayName: req.user ? req.user.displayName : '' })});
;

// app.get('/about',(req,res)=>{
//   const query = req.query.query;

//   // Use the Google Places API for text search
//   googleMapsClient.places({
//     query: query,
//   }, (err, response) => {
//     if (!err) {
//       // Assuming we have valid results
//       const results = response.json.results;
//       res.send(results);
//     } else {
//       console.error('Error:', err);
//       res.status(500).send('An error occurred.');
//     }
//   });
// });

app.get('/gg', function(req, res) {
  res.render('auth/google');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
