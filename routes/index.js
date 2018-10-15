// ================ Import Modules ================ //
const express = require('express'); // Express app
const router = express.Router(); // Express router
const User = require('../models/user'); // MongoDB User Model

// Login GET route
router.get('/login', function(req, res, next) {
    res.render('login', {loggedin: req.session.userID});
});

// Login POST route
router.post('/login', function(req, res, next) {

    // Ensure that user has provided an email and password
    if (req.body.emailLogin && req.body.pswLogin) {

        // Authenticate using function defined in MongoDB "User" model (statics object)
        User.authenticate(req.body.emailLogin, req.body.pswLogin, function (error, user) {

            // Handle incorrect credentials and any other errors
            // by creating error and forwarding it to error handler
            if (error || !user) {
                const err = new Error('Wrong email or password');
                err.status = 401;
                return next(err);
            } else { // Otherwise store user id and redirect to home route
                req.session.userID = user._id;
                req.session.username = user.username;
                console.log(user.username, req.session.username);
                res.redirect('/');
            }
        });
    } else { // Special error when user doesn't provide needed credentials
        const err = new Error('Email and password are required');
        err.status = 401;
        return next(err);
    }
});

// Register GET route
router.get('/register', function(req, res, next) {
    res.render('register', {loggedin: req.session.userID});
});

// Register POST route
router.post('/register', function(req, res, next) {

    // Ensure that user has filled all required registration fields
    if (req.body.username && req.body.email && req.body.psw && req.body.pswRepeat) {

        // Create error if passwords do not match
        if (req.body.psw !== req.body.pswRepeat) {
            const err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        }

        //  Create user data object used to add field to MongoDB "User" collection
        const userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.psw
        };

        // Add new user to MongoDB "User" collection
        User.create(userData, function(error, user) {
            if (error) { // Forward any errors to error handlers
                return next(error);
            } else { // Save user id and redirect to home route
                req.session.userID = user._id;
                return res.redirect('/');
            }
        });

    } else { // If user does not enter all required fields, create a special error
        const err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

// Logout GET route
router.get('/logout', function(req, res, next) {

    // If user is logged-in (unnecessary), destroy current session and redirect to home route
    if (req.session.userID) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                res.redirect('/');
            }
        });
    }
});

// Profile GET route
// TODO: Implement route once game is finished
router.get('/profile', function(req, res, next) {
  res.render('profile', { loggedin: req.session.userID });
});

// Profile GET route
// TODO: Get rid of this route when game is finished
router.get('/game', function(req, res, next) {
    res.render('game', { loggedin: req.session.userID })
});

// Module Exports
module.exports = router;