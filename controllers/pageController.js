// controllers/pageController.js
const { getProductsFromFile } = require ('../utils/productUtils');

exports.getHomePage = (req, res) => {
    if (req.isAuthenticated()) {
        const products = getProductsFromFile();
        res.render("index.ejs", { name: req.user.name, products });
    } else {
        res.redirect('/landing');
    }
};

exports.getLandingPage = (req, res) => {
    const allProducts = getProductsFromFile();

    if (!Array.isArray(allProducts)) {
        console.error('getProductsFromFile did not return an array');
        return res.render("landing.ejs", { products: [] });
    }

    // Shuffle the array and get the first 18 products
    const randomProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 18);
    res.render("landing.ejs", { products: randomProducts });
};