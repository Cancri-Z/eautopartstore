<<<<<<< HEAD
// routes/user.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { getMyShop, updateProfile } = require('../controllers/userController');
const { sellProduct } = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get('/my-shop', ensureAuthenticated, getMyShop);
router.post('/update-profile', ensureAuthenticated, updateProfile);
router.post('/sell', ensureAuthenticated, upload.array('photo', 10), sellProduct);

=======
// routes/user.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { getMyShop, updateProfile } = require('../controllers/userController');
const { sellProduct } = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get('/my-shop', ensureAuthenticated, getMyShop);
router.post('/update-profile', ensureAuthenticated, updateProfile);
router.post('/sell', ensureAuthenticated, upload.array('photo', 10), sellProduct);

>>>>>>> sam
module.exports = router;