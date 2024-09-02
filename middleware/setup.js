// middleware/setup.js
const express = require("express");
const session = require("express-session");
const flash = require('express-flash');
const methodOverride = require("method-override");
const passport = require("passport");
const path = require("path");
const crypto = require('crypto');

function setupMiddleware(app) {
    const SESSION_SECRET = crypto.randomBytes(64).toString('hex');

    app.use(flash());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(methodOverride("_method"));
    app.use(session({
        secret: process.env.SESSION_SECRET || SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'views'));
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    app.use((req, res, next) => {
        res.locals.user = req.user || {};
        res.locals.isUserLoggedIn = req.isAuthenticated();
        next();
    });
}

module.exports = { setupMiddleware };