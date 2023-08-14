let express = require('express');
let router = express.Router();
let userModel = require("../models/user");
let User = userModel.User;
let DB = require('../config/db')
let indexController = require('../controllers/index');
let passport = require("passport");
let mongoose = require("mongoose");
function requireAuth(req, res, next)
{
    // check if the user is logged in
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}
/* GET home page. */
router.get('/', indexController.displayHomePage);

/* GET Route for displaying the Login page */
router.get('/login', indexController.displayLoginPage);

/* POST Route for processing the Login page */
router.post('/login', indexController.processLoginPage);

/* GET Route for displaying the Register page */
router.get('/signup', indexController.displayRegisterPage);

/* POST Route for processing the Register page */
router.post('/signup', indexController.processRegisterPage);

/* GET to perform UserLogout */
router.get('/logout', indexController.performLogout);

module.exports = router;
