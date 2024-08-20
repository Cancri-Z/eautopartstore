// routes/auth.js
const express = require('express');
const router = express.Router();
const { loginUser, register, logout } = require('../controllers/authController');
const { checkNotAuthenticated } = require('../middleware/auth');
const { getAdminLogin, postAdminLogin } = require('../controllers/authController');

router.get('/login', checkNotAuthenticated, (req, res) => res.render("login.ejs", { message: req.flash('error') }));
router.post('/login', loginUser);
router.get('/register', checkNotAuthenticated, (req, res) => res.render("register.ejs"));
router.post('/register', checkNotAuthenticated, register);
router.get('/logout', logout);
router.get('/admin-login', getAdminLogin);
router.post('/admin-login', postAdminLogin);

module.exports = router;