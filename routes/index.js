<<<<<<< HEAD
// routes/index.js
const express = require('express');
const router = express.Router();
const { getLandingPage, getHomePage } = require('../controllers/pageController');
const authRoutes = require('./auth');
const productRoutes = require('./product');
const userRoutes = require('./user');
const adminRoutes = require('./admin');

function setupRoutes(app) {
    app.use('/', authRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/admin', adminRoutes);
    app.get('/', getHomePage);
    app.get('/landing', getLandingPage);
}

=======
// routes/index.js
const express = require('express');
const router = express.Router();
const { getLandingPage, getHomePage } = require('../controllers/pageController');
const authRoutes = require('./auth');
const productRoutes = require('./product');
const userRoutes = require('./user');
const adminRoutes = require('./admin');

function setupRoutes(app) {
    app.use('/', authRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/admin', adminRoutes);
    app.get('/', getHomePage);
    app.get('/landing', getLandingPage);
}

>>>>>>> sam
module.exports = { setupRoutes };