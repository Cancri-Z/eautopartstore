// Importing required libraries
const express = require ("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require("express-session");
const methodOverride = require("method-override");
const crypto = require('crypto');
const path = require("path");
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// Generate a random session secret
const SESSION_SECRET = crypto.randomBytes(64).toString('hex');

// Load environment variables from .env file
dotenv.config();

// Add the flash middleware setup before the session middleware
app.use(flash());

//For parsing
app.use(bodyParser.urlencoded({ extended: true }));

//Logging error to the console
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error to the console
    res.status(500).send('Something went wrong!'); // Send a generic error response to the client
});

// Set up session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse urlencoded request bodies
app.use(express.urlencoded({ extended: false }));

// Middleware to override HTTP methods
app.use(methodOverride("_method"));

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the root directory
app.use(express.static(__dirname));

//Serve static files from the uploads dir
app.use('/uploads', express.static('uploads'));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // specify the destination directory
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // specify the filename
    }
});
// Multer setup for file uploads
const upload = multer({ storage: storage });

// Passport Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
        try {
            const users = getUsersFromFile();
            const user = users.find(u => u.email === email);
            
            if (email === process.env.ADMIN_EMAIL) {
                const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
                if (isMatch) {
                    return done(null, { id: 'admin', email: email, isAdmin: true });
                }
            }

            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Password incorrect' });
            }

            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    if (id === 'admin') {
        done(null, { id: 'admin', email: process.env.ADMIN_EMAIL, isAdmin: true });
    } else {
        // Your existing user deserialization logic for non-admin users
        const users = getUsersFromFile();
        const user = users.find(u => u.id === id);
        done(null, user);
    }
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Middleware to pass user information to templates
app.use((req, res, next) => {
    if (req.session.passport && req.session.passport.user) {
        req.user = { id: req.session.passport.user, isAdmin: req.session.isAdmin };
    }
    next();
});

// Function to get user data from the JSON file
function getUsersFromFile() {
    try {
        const usersFilePath = path.join(__dirname, 'json_folder', 'users.json');
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            return JSON.parse(data);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error reading user data from file:', error);
        return [];
    }
}

// Function to add user data to the JSON file
function addUserToFile(userData) {
    try {
        const usersFilePath = path.join(__dirname, 'json_folder', 'users.json');
        let users = [];
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            users = JSON.parse(data);
        }
        users.push(userData);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing user data to file:', error);
    }
}


// Function to read products data from JSON file
function getProductsFromFile() {
    try {
        const productsFilePath = path.join(__dirname, 'json_folder', 'products.json');
        if (fs.existsSync(productsFilePath)) {
            const data = fs.readFileSync(productsFilePath, 'utf8');
            const productsData = JSON.parse(data);
            return productsData.products; // Access the products array
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error reading product data from file:', error);
        return [];
    }
}

// Function to get pending products
function getPendingProductsFromFile() {
    try {
        const pendingProductsFilePath = path.join(__dirname, 'json_folder', 'pending_products.json');
        if (fs.existsSync(pendingProductsFilePath)) {
            const data = fs.readFileSync(pendingProductsFilePath, 'utf8');
            console.log('Pending products read from file:', data);
            return JSON.parse(data);
        } else {
            console.log('No pending products file found');
            return [];
        }
    } catch (error) {
        console.error('Error reading pending product data from file:', error);
        return [];
    }
}

// Initialize the products JSON file if it doesn't exist
const productsFilePath = path.join(__dirname, 'json_folder', 'products.json');
if (!fs.existsSync(productsFilePath)) {
    fs.writeFileSync(productsFilePath, JSON.stringify({ products: [] }, null, 2));
}

// Route to render the user's profile form
app.get('/usersform', ensureAuthenticated, (req, res) => {
    const users = getUsersFromFile();
    const user = users.find(u => u.id === req.user.id);
    res.render('users_profile_form', { user: user || {} });
});

// Route to handle form submission
app.post('/update-profile', ensureAuthenticated, upload.single('profile_picture'), (req, res) => {
    const updatedUserData = {
        firstname: req.body.firstname,
        middlename: req.body.middlename || null,
        lastname: req.body.lastname,
        gender: req.body.gender,
        age: req.body.age,
        status: req.body.status,
        email: req.body.email,
        tel_office: req.body.tel_office || null,
        tel_home: req.body.tel_home || null,
        mobile_no: req.body.mobile_no || null,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        home_address: req.body.home_address,
        office_address: req.body.office_address,
        profile_picture: req.file ? req.file.filename : req.user.profile_picture // Use new picture if uploaded, else keep old       
    };

    const users = getUsersFromFile();
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUserData };
        fs.writeFileSync(path.join(__dirname, 'json_folder', 'users.json'), JSON.stringify(users, null, 2));
    }
    res.redirect('/profile');
});

// Route to render individual product pages
app.get('/product/:productId', (req, res) => {
    const productId = req.params.productId;
    const products = getProductsFromFile();
    const product = products.find(product => product.productId === productId);
    if (product) {
        res.render('product.ejs', { product, isUserLoggedIn: res.locals.isUserLoggedIn });
    } else {
        res.status(404).send('Product not found');
    }
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        const products = getProductsFromFile(); // Fetch products from JSON file
        res.render("index.ejs", { name: req.user.name, products }); // Pass the products array to the index template
    } else {
        res.render("landing.ejs");
    }
});

// Modify the route to render the login page
app.get('/login', (req, res) => {
    res.render("login.ejs", { message: req.flash('error') }); // Pass error message to the template
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

app.get('/reg_auth', checkNotAuthenticated, (req, res) => {
    res.render("reg_auth.ejs");
});

app.get('/landing', (req, res) => {
    const products = getProductsFromFile(); // Fetch products from JSON file
    res.render("landing.ejs", { products }); // Pass the products array to the landing template
});

app.get('/search-results', (req, res) => {
    const searchTerm = req.query.q; // Get the search term from the query parameter
    const products = getProductsFromFile(); // Fetch products from JSON file
    const mainResults = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    res.render("search-results.ejs", { searchTerm, mainResults });
});


app.get('/cart', (req, res) => {
    res.render("cartpage.ejs");
});

app.get('/brand', (req, res) => {
    const brandName = req.query.name;
    if (!brandName) {
        return res.status(400).send('Brand name is required');
    }

    const products = getProductsFromFile();
    const brandProducts = products.filter(product =>
        product.brand.toLowerCase() === brandName.toLowerCase()
    );
    res.render("brandpage.ejs", { brandName, brandProducts });
});

app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        res.render('profilepage.ejs', { user });
    } else {
        res.redirect('/login');
    }
});

app.get('/usersform', (req, res) => {
    res.render("users_profie_form.ejs");
});

app.get('/change-pword', (req, res) => {
    res.render("change-pword.ejs");
});

// Route to render the brand page
app.get('/brands/:brandName', (req, res) => {
    const brandName = req.params.brandName;
    res.render(`brands/${brandName}.ejs`);
});

// Route to serve the user.json data
app.get('/user-data', (req, res) => {
    fs.readFile(path.join(__dirname, 'json_folder', 'users.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading user data');
        }
        res.json(JSON.parse(data));
    });
});

app.get('/', (req, res) => {
    const products = getProductsFromFile(); // Fetch products from JSON file
    res.render("index.ejs", { products }); // Pass the products array to the template
});



app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.session.user = req.user;
});

app.get('/sell', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("sell.ejs", { user: req.user });
    } else {
        res.redirect("/login");
    }
});

//Logic for rendering registration form submission
app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const existingUser = getUsersFromFile().find(user => user.email === req.body.email);
        if (existingUser) {
            return res.render("register.ejs", { emailError: "User with this email already exists" });
        };

        const hashedPassword = await bcrypt.hash(req.body.password2, 10);
        const newUser = {
            id: Date.now().toString(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword
        };

        addUserToFile(newUser);
        res.redirect("/reg_auth");
    } catch (e) {
        console.log(e);
        // Redirect to the registration page with a generic error message in case of an error
        res.redirect("/register?error=generic");
    }
});

// Middleware to pass user information to templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Function to get pending products from JSON file
function getPendingProductsFromFile() {
    try {
        const pendingProductsFilePath = path.join(__dirname, 'json_folder', 'pending_products.json');
        if (fs.existsSync(pendingProductsFilePath)) {
            const data = fs.readFileSync(pendingProductsFilePath, 'utf8');
            return JSON.parse(data);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error reading pending product data from file:', error);
        return [];
    }
}

// Function to write pending products to JSON file
function writePendingProductsToFile(products) {
    try {
        const pendingProductsFilePath = path.join(__dirname, 'json_folder', 'pending_products.json');
        fs.writeFileSync(pendingProductsFilePath, JSON.stringify(products, null, 2));
        console.log('Pending products written to file');
    } catch (error) {
        console.error('Error writing pending product data to file:', error);
    }
}

// Function to write products to JSON file
function writeProductsToFile(products) {
    const productsFilePath = path.join(__dirname, 'json_folder', 'products.json');
    fs.writeFileSync(productsFilePath, JSON.stringify({ products }, null, 2));
}


function getDeniedProductsFromFile() {
    try {
        const deniedProductsFilePath = path.join(__dirname, 'json_folder', 'denied_products.json');
        if (fs.existsSync(deniedProductsFilePath)) {
            const data = fs.readFileSync(deniedProductsFilePath, 'utf8');
            return data ? JSON.parse(data) : [];  // Handle empty file scenario
        } else {
            return [];  // Return empty array if file doesn't exist
        }
    } catch (error) {
        console.error('Error reading denied product data from file:', error);
        return [];  // Return empty array on error
    }
}

function writeDeniedProductsToFile(products) {
    try {
        const deniedProductsFilePath = path.join(__dirname, 'json_folder', 'denied_products.json');
        const jsonData = JSON.stringify(products, null, 2);
        fs.writeFileSync(deniedProductsFilePath, jsonData, 'utf8');  // Ensure UTF-8 encoding
    } catch (error) {
        console.error('Error writing denied product data to file:', error);
    }
}

app.get('/admin-dashboard', (req, res) => {
    console.log('Admin dashboard route hit');
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('Is admin (from session):', req.session.isAdmin);
    
    if (req.session.isAdmin) {
        console.log('Rendering admin dashboard');
        const pendingProducts = getPendingProductsFromFile();
        const approvedProducts = getProductsFromFile().filter(p => p.status === 'approved').length;
        const deniedProducts = getDeniedProductsFromFile().length;
        res.render('admin-dashboard.ejs', {
            pendingProducts,
            approvedProducts,
            deniedProducts,
            moment: moment
        });
    } else {
        console.log('Unauthorized access to admin dashboard');
        res.redirect('/admin-login');
    }
});

// Approve product route
app.post('/approve-product/:id', ensureAuthenticated, isAdmin, (req, res) => {
    console.log('Approve product route hit');
    console.log('Session:', req.session);
    console.log('User:', req.user);
    
    if (!req.user || !req.user.isAdmin) {
        console.log('Unauthorized attempt to approve product');
        return res.status(403).send('Unauthorized');
    }
    
    const productId = req.params.id;
    console.log('Attempting to approve product:', productId);
    
    const pendingProducts = getPendingProductsFromFile();
    const products = getProductsFromFile();
    const productIndex = pendingProducts.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) {
        console.log('Product not found:', productId);
        return res.status(404).send('Product not found');
    }

    const product = pendingProducts[productIndex];
    product.status = 'approved';
    product.approvalDate = new Date().toISOString();
    products.push(product);
    pendingProducts.splice(productIndex, 1);
    
    console.log('Product approved:', product);
    
    writePendingProductsToFile(pendingProducts);
    writeProductsToFile(products);
    
    res.redirect('/admin-dashboard');
});

// Function to reject a product (optional)
app.post('/deny-product/:id', ensureAuthenticated, isAdmin, (req, res) => {
    console.log('Deny product route hit');
    console.log('Session:', req.session);
    console.log('User:', req.user);
    
   if (!req.user || !req.user.isAdmin) {
        console.log('Unauthorized attempt to deny product');
        return res.status(403).send('Unauthorized');
    }
    
    const productId = req.params.id;
    console.log('Attempting to deny product:', productId);
    
    const pendingProducts = getPendingProductsFromFile();
    const deniedProducts = getDeniedProductsFromFile();
    const productIndex = pendingProducts.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) {
        console.log('Product not found:', productId);
        return res.status(404).send('Product not found');
    }

    const product = pendingProducts[productIndex];
    product.status = 'denied';
    product.denialDate = new Date().toISOString();
    product.denialReason = req.body.denialReason || 'No reason provided';
    
    deniedProducts.push(product);
    pendingProducts.splice(productIndex, 1);
    
    console.log('Product denied:', product);
    
    writePendingProductsToFile(pendingProducts);
    writeDeniedProductsToFile(deniedProducts);
    
    res.redirect('/admin-dashboard');
});

// My Shop route
app.get('/my-shop', ensureAuthenticated, (req, res) => {
    const approvedProducts = getProductsFromFile().filter(p => p.userId === req.user.id);
    const pendingProducts = getPendingProductsFromFile().filter(p => p.userId === req.user.id);
    const deniedProducts = getDeniedProductsFromFile().filter(p => p.userId === req.user.id);
    
    const allProducts = [
        ...approvedProducts,
        ...pendingProducts,
        ...deniedProducts
    ].map(product => ({
        ...product,
        status: product.status || 'awaiting approval' // Set default status if it's missing
    }));

    res.render('my-shop', { products: allProducts });
});

// Product history route
app.get('/product-history', ensureAuthenticated, (req, res) => {
    const { startDate, endDate } = req.query;
    const products = getProductsFromFile();
    const filteredProducts = products.filter(product => {
        const date = product.approvalDate || product.denialDate;
        return (!startDate || date >= startDate) && (!endDate || date <= endDate);
    });

    res.render('product-history', { 
        products: filteredProducts, 
        startDate, 
        endDate,
        moment // Pass moment to the template for date formatting
    });
});

// Modify your existing /sell-product route
app.post("/sell-product", upload.array('photo', 10), (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('You must be logged in to post a product.');
    }

    const formData = req.body;
    const files = req.files;
    formData.photos = files.map(file => file.path);
    formData.userId = req.user.id;
    formData.productId = uuidv4();
    formData.status = 'pending'; // Set initial status to pending
    const pendingProducts = getPendingProductsFromFile();
    pendingProducts.push(formData);
    writePendingProductsToFile(pendingProducts);
    res.send("Product successfully submitted for approval.");
});


// Add this function to check if a user is an admin
function isAdmin(req, res, next) {
    console.log('isAdmin middleware called');
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('Is admin (from session):', req.session.isAdmin);
    
    if (req.user && req.user.isAdmin) {
        return next();
    }
    console.log('Not admin, redirecting to login');
    res.redirect('/admin-login');
}

app.get('/admin-login', (req, res) => {
    res.render('admin-login.ejs', { message: req.flash('error') });
});

app.post('/admin-login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/admin-login'); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            req.session.isAdmin = user.isAdmin;
            return res.redirect('/admin-dashboard');
        });
    })(req, res, next);
});

// Add this route for fetching product history (it will be called via AJAX)
app.get('/api/product-history', isAdmin, (req, res) => {
    const { startDate, endDate } = req.query;
    const products = getProductsFromFile();
    const filteredProducts = products.filter(product => {
        const date = product.approvalDate || product.denialDate;
        return (!startDate || date >= startDate) && (!endDate || date <= endDate);
    });
    res.json(filteredProducts);
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/'); // You can redirect to an error page if necessary
        }
        res.redirect('/login'); // Redirect to the login page or homepage
    });
});

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


// // server.js
// const express = require("express");
// const app = express();
// const session = require("express-session");
// const passport = require("passport");
// const flash = require('express-flash');
// const methodOverride = require("method-override");
// const path = require("path");
// const dotenv = require('dotenv');
// const initializePassport = require('./utils/passport-config');
// const { setupMiddleware } = require('./middleware/setup');
// const { setupRoutes } = require('./routes');

// dotenv.config();

// // Set up middleware
// setupMiddleware(app);

// // Set up Passport
// initializePassport(passport);

// // Set up routes
// setupRoutes(app);

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });