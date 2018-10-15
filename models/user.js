// Import Required Modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema for a User
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// Encrypt password before saving user to database
UserSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

// Add authentication function for user login
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({email: email})
        .exec(function(error, user) {
            if (error) {
                return callback(error);
            } else if (!user) {
                let err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(error,result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        })
};

// Create user model and export
const User = mongoose.model('user', UserSchema);
module.exports = User;