// controllers/adminController.js
const { getPendingProductsFromFile, getProductsFromFile, writePendingProductsToFile, writeProductsToFile, getDeniedProductsFromFile, writeDeniedProductsToFile } = require('../utils/productUtils');
const moment = require('moment');

exports.approveProduct = (req, res) => {
    const productId = req.params.id;
    const pendingProducts = getPendingProductsFromFile();
    const products = getProductsFromFile();
    const productIndex = pendingProducts.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) {
        return res.status(404).send('Product not found');
    }

    const product = pendingProducts[productIndex];
    product.status = 'approved';
    product.approvalDate = new Date().toISOString();
    products.push(product);
    pendingProducts.splice(productIndex, 1);
    
    writePendingProductsToFile(pendingProducts);
    writeProductsToFile(products);
    
    res.redirect('/admin/dashboard');
};

exports.denyProduct = (req, res) => {
    const productId = req.params.id;
    const pendingProducts = getPendingProductsFromFile();
    const deniedProducts = getDeniedProductsFromFile();
    const productIndex = pendingProducts.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) {
        return res.status(404).send('Product not found');
    }

    const product = pendingProducts[productIndex];
    product.status = 'denied';
    product.denialDate = new Date().toISOString();
    product.denialReason = req.body.denialReason || 'No reason provided';
    
    deniedProducts.push(product);
    pendingProducts.splice(productIndex, 1);
    
    writePendingProductsToFile(pendingProducts);
    writeDeniedProductsToFile(deniedProducts);
    
    res.redirect('/admin/dashboard');
};

exports.getAdminDashboard = (req, res) => {
    const pendingProducts = getPendingProductsFromFile();
    const approvedProducts = getProductsFromFile().filter(p => p.status === 'approved').length;
    const deniedProducts = getProductsFromFile().filter(p => p.status === 'denied').length;
    res.render('admin-dashboard.ejs', {
        pendingProducts,
        approvedProducts,
        deniedProducts,
        moment: moment
    });
};

exports.getProductHistory = (req, res) => {
    const { startDate, endDate } = req.query;
    const products = getProductsFromFile();
    const filteredProducts = products.filter(product => {
        const date = product.approvalDate || product.denialDate;
        return (!startDate || date >= startDate) && (!endDate || date <= endDate);
    });
    res.json(filteredProducts);
};