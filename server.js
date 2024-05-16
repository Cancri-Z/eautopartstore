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
const fs = require('fs');
const dotenv = require('dotenv');

// Generate a random session secret
const SESSION_SECRET = crypto.randomBytes(64).toString('hex');

// Load environment variables from .env file
dotenv.config();

// Add the flash middleware setup before the session middleware
app.use(flash());

//Loggins error to the console
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

// Function to read products from JSON file
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


// ROUTES
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index.ejs", { name: req.user.name });
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
    res.render("landing.ejs");
});

app.get('/sell', (req, res) => {
    res.render("sell.ejs");
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
    res.render("profilepage.ejs");
});

app.get('/toyota', (req, res) => {
    res.render("toyota.ejs");
});

app.get('/usersform', (req, res) => {
    res.render("users_profie_form.ejs");
});

app.get('/change-pword', (req, res) => {
    res.render("change-pword.ejs");
});

app.get('brands/toyota', (req, res) => {
    res.render("/brands/toyota.ejs");
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
}));



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


// Endpoint to handle users product post
app.post("/sell-product", (req, res) => {
    const formData = req.body;

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

/* // Middleware functions
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
} */

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
