// controllers/userController.js
const { getProductsFromFile, getPendingProductsFromFile, getDeniedProductsFromFile } = require('../utils/productUtils');
const { getUsersFromFile } = require('../utils/userUtils');

exports.getMyShop = (req, res) => {
    const approvedProducts = getProductsFromFile().filter(p => p.userId === req.user.id);
    const pendingProducts = getPendingProductsFromFile().filter(p => p.userId === req.user.id);
    const deniedProducts = getDeniedProductsFromFile().filter(p => p.userId === req.user.id);
    
    const allProducts = [
        ...approvedProducts,
        ...pendingProducts,
        ...deniedProducts
    ].map(product => ({
        ...product,
        status: product.status || 'awaiting approval'
    }));

    res.render('my-shop', { products: allProducts });
};

exports.updateProfile = (req, res) => {
    // Implement profile update logic here
};