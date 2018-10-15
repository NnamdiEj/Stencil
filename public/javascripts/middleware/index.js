// Middleware functions for app routes

// Ensures users are signed out before accessing a page (login page)
function loggedOut(req, res, next) {
    if (req.session && req.session.userID) {
        return res.redirect('/profile');
    }
    return next();
}

// Ensures users are signed in before accessing a particular page
function requiresLogin(req, res, next) {
    if (req.session && req.session.userID) { // Continue if user is signed in
        return next();
    } else { // Otherwise, forward a "requires login" error to error handlers
        const err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

// Module Exports
module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;