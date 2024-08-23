// controllers/authController.js
const passport = require('passport');
const bcrypt = require('bcrypt');
const { getUsersFromFile, addUserToFile } = require('../utils/userUtils');

exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return next(err);
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return next(err);
            }
            console.log('User logged in successfully');
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.register = async (req, res) => {
    try {
        const existingUser = getUsersFromFile().find(user => user.email === req.body.email);
        if (existingUser) {
            return res.render("register.ejs", { emailError: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password2, 10);
        const newUser = {
            id: Date.now().toString(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword
        };

        addUserToFile(newUser);
        res.redirect("/reg_auth");
    } catch (e) {
        console.log(e);
        res.redirect("/register?error=generic");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/login');
    });
};

exports.getAdminLogin = (req, res) => {
    res.render('admin-login.ejs', { message: req.flash('error') });
};

exports.postAdminLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/admin-login'); }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            if (user.email === process.env.ADMIN_EMAIL) {
                req.session.isAdmin = true;
                return req.session.save((err) => {
                    if (err) {
                        console.error('Error saving session:', err);
                        return next(err);
                    }
                    return res.redirect('/admin/dashboard');
                });
            }
            return res.redirect('/');
        });
    })(req, res, next);
};