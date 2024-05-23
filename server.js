// Importing required libraries
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require('express-flash');
const initializePassport = require("./passport-config");
const session = require("express-session");
const methodOverride = require("method-override");
const crypto = require('crypto');
const path = require("path");
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

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
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
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
    if (req.isAuthenticated()) {
        const users = getUsersFromFile();
        const user = users.find(u => u.id === req.user.id);
        req.user = user;
    }
    res.locals.user = req.user || {};
    res.locals.isUserLoggedIn = req.isAuthenticated();
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




// Call initialize function, passing passport, getUserByEmail, and getUserById
initializePassport(passport, 
    email => getUsersFromFile().find(user => user.email === email),
    id => getUsersFromFile().find(user => user.id === id)
);

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    // If authentication succeeds, passport adds the user object to the request object
    // Store the user object in the session
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
             // User with the entered email already exists
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



// Endpoint to handle users product post
app.post("/sell-product", upload.array('photo', 10), (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('You must be logged in to post a product.');
    }

    const formData = req.body;
    const files = req.files;

    // Add the file paths to formData
    formData.photos = files.map(file => file.path);

    // Add user ID from session
    formData.userId = req.user.id;

    // Generate a unique product ID
    formData.productId = uuidv4();

    // Read existing product data
    const productsFilePath = path.join(__dirname, 'json_folder', 'products.json');
    let products = [];
    if (fs.existsSync(productsFilePath)) {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        products = JSON.parse(data).products;
    }

    // Add new product to the products array
    products.push(formData);

    // Write updated product data back to the file
    fs.writeFileSync(productsFilePath, JSON.stringify({ products }, null, 2));

    res.send("Product successfully added.");
    });



app.delete("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
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
