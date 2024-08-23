// utils/productUtils.js
const fs = require('fs');
const path = require('path');

function getProductsFromFile() {
    try {
        const productsFilePath = path.join(__dirname, '..', 'json_folder', 'products.json');

        if (fs.existsSync(productsFilePath)) {
            const data = fs.readFileSync(productsFilePath, 'utf8');
            const parsedData = JSON.parse(data);

            // Check if the parsed data has a 'products' property
            if (parsedData && Array.isArray(parsedData.products)) {
                return parsedData.products;
            } else if (Array.isArray(parsedData)) {
                return parsedData;
            } else {
                console.error('Unexpected data structure in products.json');
                return [];
            }
        } else {
            console.error('Products file does not exist');
            return [];
        }
    } catch (error) {
        console.error('Error reading product data from file:', error);
        return [];
    }
}

function getPendingProductsFromFile() {
    // Implement this function
}

function getDeniedProductsFromFile() {
    // Implement this function
}

function writePendingProductsToFile(products) {
    // Implement this function
}

function writeProductsToFile(products) {
    // Implement this function
}

function writeDeniedProductsToFile(products) {
    // Implement this function
}

module.exports = {
    getProductsFromFile,
    getPendingProductsFromFile,
    getDeniedProductsFromFile,
    writePendingProductsToFile,
    writeProductsToFile,
    writeDeniedProductsToFile
};