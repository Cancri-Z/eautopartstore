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
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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


//Middleware to make isUserLoggedIn available in all templates
app.use((req, res, next) => {
    res.locals.isUserLoggedIn = req.isAuthenticated();
    next();
});

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the root directory
app.use(express.static(__dirname));

//Serve static files from the uploads dir
app.use('/uploads', express.static('uploads'));


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


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
      const data = fs.readFileSync(path.join(__dirname, 'json_folder', 'users.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users file:', error);
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
            return JSON.parse(data);
        } else {
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

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'eautopartstore@gmail.com',
      pass: 'qwertyuiop987654'
    }
  });

 // Handle the password change request
 app.post('/change-pword', async (req, res) => {
    const { email } = req.body;
    
    // In a real application, check if the email exists in your database
    
    const resetToken = crypto.randomBytes(20).toString('hex');
    const jwtToken = jwt.sign({ email, resetToken }, 'your-jwt-secret', { expiresIn: '1h' });
    
    const resetUrl = `http://yourdomain.com/reset-password/${jwtToken}`;
    
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, click on this link: ${resetUrl}`,
      html: `<p>To reset your password, click on this link: <a href="${resetUrl}">${resetUrl}</a></p>`
    };
    
    try {
      await transporter.sendMail(mailOptions);
      res.render('change-pword', { message: 'Password reset email sent. Please check your inbox.' });
    } catch (error) {
      console.error(error);
      res.render('change-pword', { message: 'Error sending email. Please try again.' });
    }
  });
  
  // Add this route to your server.js
app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.render('reset-password', { token });
  });
  
  // Modify the existing POST route for reset-password
  app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    try {
      const decoded = jwt.verify(token, 'your-jwt-secret');
      const { email, resetToken } = decoded;
      
      // In a real application, verify the reset token in your database
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // In a real application, update the user's password in your database
      console.log(`Updated password for ${email}: ${hashedPassword}`);
      
      res.render('reset-success');
    } catch (error) {
      console.error(error);
      res.render('reset-error');
    }
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
        const users = getUsersFromFile();
        const seller = users.find(user => user.id === product.userId);
        res.render('product.ejs', { 
            product, 
            isUserLoggedIn: req.isAuthenticated(),
            seller: seller ? {
                name: `${seller.firstname} ${seller.lastname}`,
                phone: seller.mobile_no || 'Not provided',
                whatsapp: seller.mobile_no || 'Not provided'
            } : null
        });
    } else {
        res.status(404).send('Product not found');
    }
});

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
    const brandProducts = products.filter(product => {
        // Check if product and product.brand exist before using toLowerCase()
        return product && product.brand && product.brand.toLowerCase() === brandName.toLowerCase();
    });

    // If no products found, you might want to render a "no products" message
    res.render("brandpage.ejs", { brandName, brandProducts });
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    if (req.user) {
      const users = getUsersFromFile();
      const user = users.find(u => u.id === req.user.id);
      
      if (user) {
        res.render('profilepage.ejs', { user: user });
      } else {
        res.redirect('/login');
      }
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

app.get('/sell', ensureAuthenticated, (req, res) => {
    const users = getUsersFromFile();
    const user = users.find(u => u.id === req.user.id);
    
    if (user) {
        res.render("sell.ejs", { user: user });
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
    
    if (req.session.isAdmin) {
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
        res.redirect('/admin-login');
    }
});


// Add this route to your server.js file
app.get('/user-products/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Get all products
    const allProducts = getProductsFromFile();
    
    // Filter products by user ID and remove duplicates
    const userProducts = allProducts.filter(product => product.userId === userId)
        .filter((product, index, self) =>
            index === self.findIndex((t) => t.productId === product.productId)
        );
    
    // Get user details
    const users = getUsersFromFile();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).send('User not found');
    }
    
    res.render('user-products.ejs', { 
        user: user, 
        products: userProducts,
        formatNumber: (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    });
});

// Approve product route
app.post('/approve-product/:id', ensureAuthenticated, isAdmin, (req, res) => {
    
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send('Unauthorized');
    }
    
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
    
    res.json({ success: true, message: 'Product approved successfully' });
});

// Function to reject a product (optional)
app.post('/deny-product/:id', ensureAuthenticated, isAdmin, (req, res) => {
    
   if (!req.user || !req.user.isAdmin) {
        console.log('Unauthorized attempt to deny product');
        return res.status(403).send('Unauthorized');
    }
    
    const productId = req.params.id;
    
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
    
    writePendingProductsToFile(pendingProducts);
    writeDeniedProductsToFile(deniedProducts);
    
    res.json({ success: true, message: 'Product denied successfully' });
});

// My Shop route
app.get('/my-shop', ensureAuthenticated, (req, res) => {
    try {
        const userId = req.user.id;
        const approvedProducts = getProductsFromFile().filter(p => p.userId === userId);
        const pendingProducts = getPendingProductsFromFile().filter(p => p.userId === userId);
        const deniedProducts = getDeniedProductsFromFile().filter(p => p.userId === userId);
        const allProducts = [...approvedProducts, ...pendingProducts, ...deniedProducts];
        res.render('my-shop', { products: allProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

app.get('/payment-gateway', ensureAuthenticated, (req, res) => {
    const productId = req.query.productId;
    // You might want to fetch the product details here
    res.render('payment-gateway', { productId });
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
app.post("/submit-product", upload.array('photos', 4), (req, res) => {
    try {
        const productData = req.body;

         // Add current timestamp
         productData.submissionTime = new Date().toISOString();
        
        // Check if files were uploaded
        if (req.files && req.files.length > 0) {
            // Map the file paths and add them to productData
            productData.photos = req.files.map(file => '/uploads/' + file.filename);
        } else {
            productData.photos = []; // Ensure photos is an array even if no files were uploaded
        }

        // Get the current user
        const users = getUsersFromFile();
        const currentUser = users.find(user => user.id === req.user.id);

        if (!currentUser) {
            throw new Error('User not found');
        }

        // Add user information to the product data
        productData.userName = `${currentUser.firstname} ${currentUser.lastname}`;
        productData.location = productData.location || 'Not provided';

        productData.status = productData.boostOption === 'no-bst' ? 'pending' : 'approved';
        productData.productId = uuidv4();
        productData.userId = req.user.id;

        const pendingProducts = getPendingProductsFromFile();
        const products = getProductsFromFile();

        if (!productData.year) {
            productData.year = productData.yearOption === 'single' ? productData.year : `${productData.yearFrom}-${productData.yearTo}`;
        }

        if (productData.status === 'pending') {
            pendingProducts.push(productData);
            writePendingProductsToFile(pendingProducts);
        } else {
            products.push(productData);
            writeProductsToFile(products);
        }

        res.json({ 
            success: true, 
            productId: productData.productId,
            status: productData.status,
            photos: productData.photos // Send photo paths back to client
        });
    } catch (error) {
        console.error('Error submitting product:', error);
        res.status(500).json({ success: false, error: 'Failed to submit product' });
    }
});                                                                                                    

// Add this function to check if a user is an admin
function isAdmin(req, res, next) {
    
    if (req.user && req.user.isAdmin) {
        return next();
    }
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