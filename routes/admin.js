<<<<<<< HEAD
// routes/admin.js
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const { approveProduct, denyProduct, getAdminDashboard, getProductHistory } = require('../controllers/adminController');

router.post('/approve-product/:id', isAdmin, approveProduct);
router.post('/deny-product/:id', isAdmin, denyProduct);
router.get('/dashboard', isAdmin, getAdminDashboard);
router.get('/product-history', isAdmin, getProductHistory);

=======
// routes/admin.js
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const { approveProduct, denyProduct, getAdminDashboard, getProductHistory } = require('../controllers/adminController');

router.post('/approve-product/:id', isAdmin, approveProduct);
router.post('/deny-product/:id', isAdmin, denyProduct);
router.get('/dashboard', isAdmin, getAdminDashboard);
router.get('/product-history', isAdmin, getProductHistory);

>>>>>>> sam
module.exports = router;