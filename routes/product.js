// routes/product.js
const express = require('express');
const router = express.Router();
const { searchProducts, getProductById, getBrandProducts } = require('../controllers/productController');

router.get('/search', searchProducts);
router.get('/:productId', getProductById);
router.get('/brand/:brandName', getBrandProducts);

module.exports = router;