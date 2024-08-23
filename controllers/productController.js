// controllers/productController.js
const { v4: uuidv4 } = require('uuid');
const { getProductsFromFile } = require('../utils/productUtils');
const { writePendingProductsToFile } = require('../utils/productUtils');

exports.searchProducts = (req, res) => {
    const searchTerm = req.query.q;
    const products = getProductsFromFile();
    const mainResults = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    res.render("search-results.ejs", { searchTerm, mainResults });
};

exports.getProductById = (req, res) => {
    const productId = req.params.productId;
    const products = getProductsFromFile();
    const product = products.find(product => product.productId === productId);
    if (product) {
        res.render('product.ejs', { product, isUserLoggedIn: res.locals.isUserLoggedIn });
    } else {
        res.status(404).send('Product not found');
    }
};

exports.getBrandProducts = (req, res) => {
    const brandName = req.params.brandName;
    const products = getProductsFromFile();
    const brandProducts = products.filter(product =>
        product.brand.toLowerCase() === brandName.toLowerCase()
    );
    res.render("brandpage.ejs", { brandName, brandProducts });
};


exports.sellProduct = (req, res) => {
    const formData = req.body;
    const files = req.files;
    formData.photos = files.map(file => file.path);
    formData.userId = req.user.id;
    formData.productId = uuidv4();
    formData.status = 'pending';
    const pendingProducts = getPendingProductsFromFile();
    pendingProducts.push(formData);
    writePendingProductsToFile(pendingProducts);
    res.send("Product successfully submitted for approval.");
};