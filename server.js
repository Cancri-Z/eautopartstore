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

const adminUsers = [
    { email: process.env.ADMIN1_EMAIL, password: process.env.ADMIN1_PASSWORD },
    { email: process.env.ADMIN2_EMAIL, password: process.env.ADMIN2_PASSWORD }
    // Add more admin users as needed
  ];

  
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

//The flash setup should always be after the session middleware
// Add the flash middleware setup before the session middleware
app.use(flash());



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
const upload = multer({ storage: storage });


// Passport Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        const users = getUsersFromFile();
        const user = users.find(u => u.email === email);
        
        // Check if it's an admin login
        const adminUser = adminUsers.find(admin => admin.email === email);
        if (adminUser) {
          const isMatch = await bcrypt.compare(password, adminUser.password);
          if (isMatch) {
            return done(null, { id: email, email: email, isAdmin: true });
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
  const adminUser = adminUsers.find(admin => admin.email === id);
  if (adminUser) {
    done(null, { id: id, email: id, isAdmin: true });
  } else {
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


//Fetch products from the json_folder for editing
function getAllProducts() {
  const products = [];
  const productFiles = [
      'products.json',
      'approved_products.json',
      'pending_products.json',
      'denied_products.json'
  ];

  productFiles.forEach(file => {
      const filePath = path.join(__dirname, 'json_folder', file);

      if (fs.existsSync(filePath)) {
          try {
              const data = fs.readFileSync(filePath, 'utf8');
              if (!data.trim()) {
                  console.log(`Skipping empty file: ${file}`);
                  return;
              }

              const fileData = JSON.parse(data);
              const fileProducts = Array.isArray(fileData) ? fileData : fileData.products || [];
              products.push(...fileProducts);
          } catch (error) {
              console.error(`Error reading or parsing file: ${file}`, error.message);
          }
      }
  });

  // Remove duplicate products based on productId
  const uniqueProducts = products.filter((product, index, self) =>
      index === self.findIndex(p => p.productId === product.productId)
  );

  console.log('Unique product IDs:', uniqueProducts.map(p => p.productId));

  return uniqueProducts;
};







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
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

  // Verify the transporter
transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

// Function to send verification email
async function sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.BASE_URL}/verify-email/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `
    };
  
    try {
        console.log('Attempting to send email...');
        console.log('Email options:', JSON.stringify(mailOptions, null, 2));
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        console.log(`Verification email sent to ${email}`);
      } catch (error) {
        console.error('Error sending verification email:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error; // Re-throw the error so it can be caught in the registration route
      }
  }
  
  
 
 // Email verification route
app.get('/verify-email/:token', (req, res) => {
    const { token } = req.params;
    const users = getUsersFromFile();
    const user = users.find(u => u.verificationToken === token);
  
    if (user) {
      user.isVerified = true;
      user.verificationToken = null;
      try {
        fs.writeFileSync(path.join(__dirname, 'json_folder', 'users.json'), JSON.stringify(users, null, 2));
        req.flash('success', 'Your email has been verified. You can now log in.');
        res.redirect('/login');
      } catch (err) {
        console.error('Error writing to users.json:', err);
        req.flash('error', 'An error occurred. Please try again later.');
        res.redirect('/login');
      }
    } else {
      req.flash('error', 'Invalid or expired verification token.');
      res.redirect('/login');
    }
  });

  app.get('/resend-verification', async (req, res) => {
    try {
        // Retrieve the user's email from the session or database
        const userEmail = req.session.userEmail; // Assuming you stored it in the session during registration
        
        if (!userEmail) {
            return res.status(400).send('User email not found. Please try registering again.');
        }

        // Retrieve the user from the database
        const users = getUsersFromFile();
        const user = users.find(u => u.email === userEmail);

        if (!user) {
            return res.status(404).send('User not found. Please try registering again.');
        }

        if (user.isVerified) {
            return res.send('Your account is already verified. Please login.');
        }

        // Generate a new verification token
        const newVerificationToken = crypto.randomBytes(20).toString('hex');
        user.verificationToken = newVerificationToken;

        // Update the user in the database
        const updatedUsers = users.map(u => u.email === userEmail ? user : u);
        fs.writeFileSync(path.join(__dirname, 'json_folder', 'users.json'), JSON.stringify(updatedUsers, null, 2));

        // Send the verification email
        await sendVerificationEmail(user.email, newVerificationToken);

        // Redirect back to the registration success page with a success message
        req.flash('success', 'Verification email resent. Please check your inbox.');
        res.redirect('/registration-success');
    } catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).send('An error occurred while resending the verification email. Please try again later.');
    }
});

    app.get('/forgot-password', (req, res) => {
        res.render('forgot-password.ejs', { message: req.flash('info') });
    });
  
  // Password reset request route
  app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const users = getUsersFromFile();
    const user = users.find(u => u.email === email);
  
    if (!user) {
      return res.status(404).json({ message: 'If an account with that email exists, we have sent a password reset link.' });
    }
  
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
  
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
  
    try {
      fs.writeFileSync(path.join(__dirname, 'json_folder', 'users.json'), JSON.stringify(users, null, 2));
      await sendPasswordResetEmail(user.email, resetToken);
      res.json({ message: 'A password reset link has been sent to your email.' });
    } catch (error) {
      console.error('Error during password reset process:', error);
      res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
  });
  
  // Password reset route
  app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.render('reset-password.ejs', { token, message: req.flash('error') });
  });



  
  app.post('/reset-password', async (req, res) => {
    const { token, password, confirmPassword } = req.body;
    const users = getUsersFromFile();
    const user = users.find(u => u.resetToken === token && u.resetTokenExpiry > Date.now());
  
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
  
      fs.writeFileSync(path.join(__dirname, 'json_folder', 'users.json'), JSON.stringify(users, null, 2));
      await sendPasswordChangedEmail(user.email);
      res.json({ message: 'Your password has been reset successfully. You can now log in with your new password.' });
    } catch (err) {
      console.error('Error during password reset:', err);
      res.status(500).json({ message: 'An error occurred while resetting your password. Please try again.' });
    }
  });

  async function sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
  
  async function sendPasswordChangedEmail(email) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password Has Been Changed',
      html: `
        <h1>Password Changed Successfully</h1>
        <p>Your password has been changed successfully.</p>
        <p>If you didn't make this change, please contact our customer service immediately.</p>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password changed confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password changed email:', error);
      throw error;
    }
  }
  
  
// Route to handle form submission
app.post('/update-profile', ensureAuthenticated, upload.single('profile_picture'), (req, res) => {
    const updatedUserData = {
        firstname: req.body.firstname,
        middlename: req.body.middlename || null,
        lastname: req.body.lastname,
        bizname: req.body.bizname || null,
        gender: req.body.gender,
        age: req.body.age,
        status: req.body.status,
        email: req.body.email,
        tel_office: req.body.tel_office || null,
        whatsapp_no: req.body.tel_home || null,
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



//ROUTES TO RENDER PAGES
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

app.get('/login', (req, res) => {
  res.render('login', { messages: req.flash() });
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

app.get('/contact-us', (req, res) => {
  res.render('contact-us');
});

app.get('/about-us', (req, res) => {
  res.render('about-us');
});


//Routes to get Policy-docs
app.get('/terms-and-conditions', (req, res) => {
  res.render('policy-docs/terms-and-conditions');
});

app.get('/billing-policy', (req, res) => {
  res.render('policy-docs/billing-policy');
});

app.get('/cookie-policy', (req, res) => {
  res.render('policy-docs/cookie-policy');
});

app.get('/copyright-infringement-policy', (req, res) => {
  res.render('policy-docs/copyright-infringement-policy');
});

app.get('/privacy-policies', (req, res) => {
  res.render('policy-docs/privacy-policies');
});
//end


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



// Route to render the brand page with user object
app.get('/brands/:brandName', (req, res) => {
    const brandName = req.params.brandName;
    const user = req.user; // Get the authenticated user, if available
    res.render(`brands/${brandName}.ejs`, { user: user }); // Pass the `user` to the template
});


app.get('/brandpage', (req, res) => {
    const user = req.user; // Get the authenticated user, if available
    res.render('brandpage', { user: user }); // Pass the `user` to the template
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


//Flash messages to login page
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message || 'Authentication failed');
      return res.redirect('/login');
    }
    if (!user.isVerified) {
      req.flash('error', 'Please verify your email before logging in.');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Logged in successfully');
      return res.redirect("/");
    });
  })(req, res, next);
});

app.get('/sell', ensureAuthenticated, (req, res) => {
  const users = getUsersFromFile();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.redirect("/login");

  const { productId, edit } = req.query;

  // Get current year and start year for the form
  const currentYear = new Date().getFullYear();
  const startYear = 1980; // Adjust this value as needed

  let product = null; // Initialize product to null by default

  if (edit && productId) {
      const products = getAllProducts();  // Fetch from all sources
      product = products.find(p => p.productId === String(productId));

      if (!product) {
          console.log('Product not found');
          return res.status(404).send('Product not found');
      }
  }

  // If no product, set default yearOption to 'single'
  if (!product) {
      product = { yearOption: 'single' };  // Set default yearOption
  }

  res.render('sell.ejs', { user, product, currentYear, startYear });
});









// Modify your registration route to include email verification
app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
      const existingUser = getUsersFromFile().find(user => user.email === req.body.email);
      if (existingUser) {
        return res.render("register.ejs", { emailError: "User with this email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(req.body.password2, 10);
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const newUser = {
        id: Date.now().toString(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        bizname: req.body.bizname,
        password: hashedPassword,
        isVerified: false,
        verificationToken: verificationToken
      };
  
      addUserToFile(newUser);

       // Store the user's email in the session
       req.session.userEmail = newUser.email;
  
      // Send verification email
      await sendVerificationEmail(newUser.email, verificationToken);
  
      res.render("registration-success.ejs", { message: "Please check your email to verify your account." });
    } catch (e) {
        console.error('Error during registration:', e);
        console.error('Error stack:', e.stack);
        res.redirect("/register?error=generic");
      }
  });
  
  app.get("/registration-success", (req, res) => {
    const successMessage = req.flash('success')[0];
    res.render("registration-success.ejs", { message: successMessage });
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
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const productId = req.params.id;
    const denialReason = req.body.denialReason;
    
    if (!denialReason || denialReason.trim() === '') {
        return res.status(400).json({ success: false, message: 'Please provide a reason for denial.' });
    }
    
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
    product.denialReason = denialReason;
    
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

        // Fetch the current user's data
        const users = getUsersFromFile();
        const currentUser = users.find(u => u.id === userId);

        if (!currentUser) {
            throw new Error('User not found');
        }

        res.render('my-shop', { 
            products: allProducts, 
            user: currentUser,
            BASE_URL: process.env.BASE_URL || 'http://localhost:3000' // Provide a default value
        });
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
app.get('/api/product-history', isAdmin, (req, res) => {
    const { startDate, endDate } = req.query;
    const approvedProducts = getProductsFromFile().filter(p => p.status === 'approved');
    const deniedProducts = getDeniedProductsFromFile();
    const allProducts = [...approvedProducts, ...deniedProducts];
    
    const filteredProducts = allProducts.filter(product => {
        const date = new Date(product.approvalDate || product.denialDate);
        return (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate));
    });
    
    res.json(filteredProducts);
});



// /Submit-product route
app.post("/submit-product", upload.array('photos', 4), (req, res) => {
  try {
      const productData = req.body;
      const productId = productData.productId;

      // Add current timestamp
      productData.submissionTime = new Date().toISOString();

      // Check if files were uploaded
      if (req.files && req.files.length > 0) {
          productData.photos = req.files.map(file => '/uploads/' + file.filename);
      }

      const users = getUsersFromFile();
      const currentUser = users.find(user => user.id === req.user.id);
      if (!currentUser) throw new Error('User not found');

      productData.userName = `${currentUser.firstname} ${currentUser.lastname}`;
      productData.location = productData.location || 'Not provided';
      productData.bizname = currentUser.bizname || 'Not provided';
      productData.status = productData.boostOption === 'no-bst' ? 'pending' : 'approved';
      productData.userId = req.user.id;

      const pendingProducts = getPendingProductsFromFile();
      const products = getProductsFromFile();

      // Handle the year option logic
      const { yearOption, year, startYear, endYear } = req.body;
      productData.yearOption = yearOption;

      if (yearOption === 'single') {
          productData.year = year;  // Capture single year
      } else if (yearOption === 'interval') {
          productData.startYear = startYear;
          productData.endYear = endYear;
      }

      // Handle updating an existing product
      if (productId) {
          const existingProductIndex = products.findIndex(p => p.productId === productId);
          if (existingProductIndex !== -1) {
              // Update the existing product
              products[existingProductIndex] = { ...products[existingProductIndex], ...productData };
          }
      } else {
          // Handle creating a new product
          productData.productId = uuidv4();
          if (!productData.year) {
              productData.year = productData.yearOption === 'single' ? productData.year : `${productData.startYear}-${productData.endYear}`;
          }

          if (productData.status === 'pending') {
              pendingProducts.push(productData);
              writePendingProductsToFile(pendingProducts);
          } else {
              products.push(productData);
              writeProductsToFile(products);
          }
      }

      writeProductsToFile(products); // Save updated products list

      res.json({
          success: true,
          productId: productData.productId,
          status: productData.status,
          photos: productData.photos
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
      if (user.isAdmin) {
        req.session.isAdmin = true;
        return res.redirect('/admin-dashboard');
      } else {
        req.logout((err) => {
          if (err) { return next(err); }
          req.flash('error', 'You are not authorized to access the admin dashboard');
          return res.redirect('/admin-login');
        });
      }
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