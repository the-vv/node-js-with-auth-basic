var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');
var User = require('./userSchema');

module.exports = {
    // CREATES A NEW USER
    signup: (values) => {
        return new Promise((resolve, reject) => {
            User.findOne({ email: values.email }, function (err, user) {
                if (err) {
                    reject({ status: "There was a problem finding user, Please try again later", error: err })
                };
                if (user) {
                    reject({ error: 'existing User', status: 'User with this email id already exists' });
                }
                else {
                    var hashedPassword = bcrypt.hashSync(values.password, 8);
                    User.create({
                        name: values.name,
                        email: values.email,
                        password: hashedPassword
                    },
                        function (err, user) {
                            if (err) {
                                reject({ status: "There was a problem signing up, Please try again later", error: err })
                            };
                            var token = jwt.sign({ id: user._id }, config.JwtSecret);
                            resolve({ token, success: true, user });
                        });
                }
            });
        })
    },
    login: (values) => {
        return new Promise((resolve, reject) => {
            User.findOne({ email: values.email })
                .then(user => {
                    if (!user) return reject({ error: 'noUser', status: 'No user found with this email id' });
                    var passwordIsValid = bcrypt.compareSync(values.password, user.password);
                    if (!passwordIsValid) reject({ error: 'incorrectPassword', status: 'Your password is incorrect' });
                    var token = jwt.sign({ id: user._id }, config.JwtSecret);
                    resolve({ success: true, token, user });
                })
                .catch(err => {
                    if (err) return reject({ error: err, status: 'Error finding user, Please try again later' });
                })
        })
    },
    getUser: (values) => {
        return new Promise((resolve, reject) => {
            var token = values.token;
            if (!token) reject({ success: false, status: 'No token provided.' });
            jwt.verify(token, config.JwtSecret, function (err, decoded) {
                if (err) reject({ success: false, status: 'Failed to authenticate, Please try again later' });
                User.findById(decoded.id, { password: 0, __v: 0 })
                    .then(user => {
                        if (!user) return reject({ error: true, status: 'Unable to find verified user' });
                        resolve({ success: true, user, token });
                    })
                    .catch(err => {
                        if (err) return reject({ status: "There was a problem finding the user, Please try again leter", error: err });
                    })
            });
        })
    },
    checkEmail: (email) => {
        return new Promise((resolve, reject) => {
            User.findOne({ email: email }, { password: 0, __v: 0 })
                .then(user => {
                    if (!user) return reject({ success: false, status: 'Unable to find user' });
                    resolve({ success: true, user });
                })
                .catch(err => {
                    if (err) return reject({ status: "There was a problem finding the user, Please try again leter", error: err });
                })
        })
    },
    delete: () => {
        // DELETES A USER FROM THE DATABASE
        User.findByIdAndRemove(values._id, function (err, user) {
            if (err) return { status: "There was a problem deleting a user.", error: err };
            return { success: true, user };
        });
    },
    update: (user) => {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(user._id, user, { new: true })
                .then((user) => {
                    if (!user) return reject({ status: "There was a problem updating the user.", error: err });
                    resolve({ success: true, user });
                })
                .catch(err => {
                    if (err) return reject({ status: "There was a problem updating the user.", error: err });
                });
        })
    },
    verifyPassword: (data) => {
        return new Promise((resolve, reject) => {
            User.findOne({ email: data.email })
                .then(user => {
                    if (!user) return reject('No user found with this email id');
                    var passwordIsValid = bcrypt.compareSync(data.password, user.password);
                    if (!passwordIsValid) resolve({ success: false });
                    else resolve({ success: true });
                })
                .catch(err => {
                    if (err) return reject('Error verifying password, Please try again later');
                })
        })
    }
}