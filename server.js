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
const notificationsFile = path.join(__dirname, 'json_folder', 'notifications.json');
const FILES = {
  pending: path.join(__dirname, 'json_folder', 'pending_products.json'),
  products: path.join(__dirname, 'json_folder', 'products.json'),
  denied: path.join(__dirname, 'json_folder', 'denied_products.json')
};

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

  // Add static file serving for the uploads directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
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

// Logout destroy session
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.redirect('/'); // You can redirect to an error page if necessary
      }
      res.redirect('/login'); // Redirect to the login page or homepage
  });
});

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


function checkUserStatus(req, res, next) {
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect('/login'); // Redirect to login if userId is not in session
  }

  fs.readFile(path.join(__dirname, 'json_folder', 'users.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return res.status(500).send('Error checking user status');
    }
    try {
      const users = JSON.parse(data);
      const user = users.find(u => u.id === userId);
  
      if (!user) {
        return res.status(403).send('User not found');
      }
  
      if (user.isActive === false) {
        return res.status(403).render('account-banned', {
          message: "Your account has been deactivated. Contact customer service."
        });
      }
  
      // User is active, proceed to the next middleware
      next();
    } catch (parseError) {
      console.error('Error parsing users.json:', parseError);
      return res.status(500).send('Error processing user data');
    }
  });  
}

// Ensure folder exists
function ensureDirectoryExists() {
  if (!fs.existsSync(JSON_FOLDER)) {
      fs.mkdirSync(JSON_FOLDER, { recursive: true });
  }
}

// Function to get products from products.json
function getProductsFromFile() {
  try {
      const products = readJsonFile(FILES.products); // Now products should be an array
      // Check if the data is an array
      if (Array.isArray(products)) {
          return products.filter(product => product.status === 'approved');
      } else {
          console.error("Products data is unavailable or improperly formatted. Expected an array.");
          return []; // Return an empty array to prevent issues in calling code
      }
  } catch (error) {
      console.error('Error in getProductsFromFile:', error);
      return []; // Return an empty array if an error occurs
  }
}


// Function to read products data from JSON file
function getApprovedProducts() {
  try {
      const productsFilePath = path.join(__dirname, 'json_folder', 'products.json');
      if (fs.existsSync(productsFilePath)) {
          const data = fs.readFileSync(productsFilePath, 'utf8');
          const productsData = JSON.parse(data);
          
          // Convert products object to array and filter approved products
          if (productsData && productsData.products) {
              const productsArray = Object.values(productsData.products);
              return productsArray.filter(product => 
                  product && 
                  product.status === "approved"
              );
          }
      }
      return readJsonFile(FILES.products, true);
  } catch (error) {
      console.error('Error reading approved products:', error);
      return readJsonFile(FILES.products, true);
  }
}

//Fetch products from the json_folder for editing
function getAllProducts() {
  try {
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
                  if (!data.trim()) return;

                  const fileData = JSON.parse(data);
                  // Handle both array and object structures
                  if (fileData.products) {
                      // If it's an object with products property
                      const productsArray = Object.values(fileData.products);
                      products.push(...productsArray);
                  } else if (Array.isArray(fileData)) {
                      // If it's directly an array
                      products.push(...fileData);
                  }
              } catch (error) {
                  console.error(`Error reading or parsing ${file}:`, error);
              }
          }
      });

      return products;
  } catch (error) {
      console.error('Error in getAllProducts:', error);
      return readJsonFile(FILES.products, true);
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
            return readJsonFile(FILES.products, true);
        }
    } catch (error) {
        console.error('Error reading pending product data from file:', error);
        return readJsonFile(FILES.products, true);
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
        return res.status(400).json({ message: '⚠️Passwords do not match.' });
      }

      // Check if the new password is the same as the old password
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: '⚠️New password must be different from the old password.' });
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
        res.status(500).json({ message: '⚠️An error occurred while resetting your password. Please try again.' });
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
app.post('/update-profile', ensureAuthenticated, (req, res, next) => {
  // Create a temporary multer instance for profile picture uploads
  const uploadProfilePicture = multer({
      storage: multer.diskStorage({
          destination: function (req, file, cb) {
              cb(null, path.join(__dirname, 'uploads', 'user-profile-pics')); // Specific directory for profile pictures
          },
          filename: function (req, file, cb) {
              cb(null, Date.now() + '-' + file.originalname); // Unique filename
          }
      })
  }).single('profile_picture'); // Specify the field name for profile picture

  uploadProfilePicture(req, res, function (err) {
      if (err) {
          console.error('Upload error:', err);
          return res.status(500).send('File upload failed.');
      }

      const users = getUsersFromFile();
      const userIndex = users.findIndex(u => u.id === req.user.id);

      if (userIndex !== -1) {
        // Retain the existing profile picture if none was uploaded
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
          whatsapp_no: req.body.whatsapp_no || null,
          mobile_no: req.body.mobile_no || null,
          country: req.body.country,
          state: req.body.state,
          city: req.body.city,
          home_address: req.body.home_address,
          office_address: req.body.office_address,
          profile_picture: req.file 
          ? `/uploads/user-profile-pics/${req.file.filename}` 
          : users[userIndex].profile_picture
        };

        users[userIndex] = { ...users[userIndex], ...updatedUserData };

        fs.writeFileSync(path.join(__dirname, 'json_folder', 'users.json'), JSON.stringify(users, null, 2));
      }
      res.redirect('/profile');
  });
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
            user: req.user || null, // Pass the user object
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
  try {
      if (req.isAuthenticated()) {
          const approvedProducts = getApprovedProducts();
          res.render("index.ejs", { 
              name: req.user.name,
              products: approvedProducts,
              error: null 
          });
      } else {
          res.redirect("/landing");
      }
  } catch (error) {
      console.error('Error in home route:', error);
      res.render("index.ejs", { 
          name: req.user ? req.user.name : '',
          products: [],
          error: "Error loading products"
      });
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
  try {
      const approvedProducts = getApprovedProducts();
      res.render("landing.ejs", { 
          products: approvedProducts,
          error: null
      });
  } catch (error) {
      console.error('Error in landing route:', error);
      res.render("landing.ejs", { 
          products: [],
          error: "Error loading products"
      });
  }
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

// Route for banned users
app.get('/account-banned', (req, res) => {
  res.render('account-banned', {
    message: "Your account has been deactivated due consistent report of products sold by you. Please contact Customer Service for further inquiries."
  });
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
      req.session.userId = user.id;
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
      // Check if user with the same email already exists
      const existingUser = getUsersFromFile().find(user => user.email === req.body.email);
      if (existingUser) {
          return res.render("register.ejs", { emailError: "User with this email already exists" });
      }

      // Check if the bizname is provided and if it's already used
      if (req.body.bizname && req.body.bizname.trim() !== '') {
          const existingBizname = getUsersFromFile().find(user => user.bizname && user.bizname.toLowerCase() === req.body.bizname.toLowerCase());
          if (existingBizname) {
              return res.render("register.ejs", { biznameError: "This business name is already taken" });
          }
      }

      // Hash the password and generate a verification token
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
          verificationToken: verificationToken,
          isActive: true
      };

      // Add the user to the file (or database)
      addUserToFile(newUser);

      // Store the user's email in the session
      req.session.userEmail = newUser.email;

      // Send verification email
      await sendVerificationEmail(newUser.email, verificationToken);

      // Create welcome notification for the user
      await createNotification(newUser.id, `Welcome to our platform, ${newUser.firstname}! We're excited to have you here.`, 'welcome');

      // Render registration success message
      res.render("registration-success.ejs", { message: "Please check your email to verify your account." });
  } catch (e) {
      console.error('Error during registration:', e);
      console.error('Error stack:', e.stack);
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
      ensureFileExists(pendingProductsFilePath);
      const data = fs.readFileSync(pendingProductsFilePath, 'utf8');
      return data ? JSON.parse(data) : [];
  } catch (error) {
      console.error('Error reading pending product data from file:', error);
      return readJsonFile(FILES.products, true);
  }
}

// Add these helper functions at the start of your server file
function ensureFileExists(filePath) {
  try {
      if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      }
  } catch (error) {
      console.error('Error in ensureFileExists:', error);
      throw error;
  }
}

function checkPendingProducts() {
  try {
      const fileContent = fs.readFileSync(FILES.pending, 'utf8');
      const pendingProducts = JSON.parse(fileContent);
      console.log('Current pending products:', {
          count: pendingProducts.length,
          productIds: pendingProducts.map(p => p.productId)
      });
      return pendingProducts;
  } catch (error) {
      console.error('Error checking pending products:', error);
      return [];
  }
}

// Function to add product to pending products
async function addToPendingProducts(productData) {
  try {
      ensureFileExists(FILES.pending);
      const pendingProducts = await readJsonFile(FILES.pending);
      
      // Remove any existing versions of this product
      const filteredProducts = pendingProducts.filter(p => p.productId !== productData.productId);
      
      // Add the new product
      filteredProducts.push({
          ...productData,
          status: 'pending',
          lastUpdated: new Date().toISOString()
      });

      await writeJsonFile(FILES.pending, filteredProducts);
      return true;
  } catch (error) {
      console.error('Error in addToPendingProducts:', error);
      throw error;
  }
}


// Function to write pending products to JSON file
function writePendingProductsToFile(products) {
  try {
      const pendingProductsFilePath = path.join(__dirname, 'json_folder', 'pending_products.json');
      ensureFileExists(pendingProductsFilePath);
      fs.writeFileSync(pendingProductsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
      console.error('Error writing pending product data to file:', error);
      throw error;
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
      
      // Check if file exists
      if (!fs.existsSync(deniedProductsFilePath)) {
          console.log('Denied products file does not exist, creating empty file');
          fs.writeFileSync(deniedProductsFilePath, '[]', 'utf8');
          return [];
      }
      
      const data = fs.readFileSync(deniedProductsFilePath, 'utf8');
      if (!data.trim()) {
          return [];
      }
      
      return JSON.parse(data);
  } catch (error) {
      console.error('Error reading denied products file:', error);
      return []; // Return empty array on error
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

// Read JSON file with proper structure handling
function readJsonFile(filePath) {
  try {
      ensureFileExists(filePath);
      const data = fs.readFileSync(filePath, 'utf8');
      const trimmedData = data.trim();
      
      if (!trimmedData) {
          return [];
      }

      const parsedData = JSON.parse(trimmedData);
      
      // Handle products.json special structure
      if (filePath === FILES.products && parsedData.products) {
          return Array.isArray(parsedData.products) ? parsedData.products : [];
      }
      
      // For other files, ensure we always return an array
      return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
      console.error(`Error reading/parsing file ${filePath}:`, error);
      return [];
  }
}

function writeJsonFile(filePath, data) {
  try {
      ensureFileExists(filePath);
      
      // Ensure data is an array
      const arrayData = Array.isArray(data) ? data : [];
      
      // Handle products.json special structure
      if (filePath === FILES.products) {
          fs.writeFileSync(filePath, JSON.stringify({ products: arrayData }, null, 2));
      } else {
          fs.writeFileSync(filePath, JSON.stringify(arrayData, null, 2));
      }
  } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
      throw error;
  }
}


// API route to get product stats
app.get('/api/product-stats', async (req, res) => {
  try {
    // Read both files using the existing readJsonFile function
    const products = readJsonFile(FILES.products);
    const pendingProducts = readJsonFile(FILES.pending);

    // Count products with status 'approved' from products array
    const approvedProducts = products.filter(product => product.status === 'approved');
    
    // Count products with status 'pending' from pendingProducts array
    const pendingCount = pendingProducts.length;

    const stats = {
      totalProducts: approvedProducts.length,
      totalPendingProducts: pendingCount
    };

    res.json(stats);
  } catch (error) {
    console.error('Error in /api/product-stats:', error);
    res.status(500).json({ error: 'Error fetching product stats', details: error.message });
  }
});

// poghmt90ghmgh90ih

// Search product for Admins
app.get('/api/search-products', async (req, res) => {
  try {
    const searchTerm = req.query.term ? req.query.term.toLowerCase() : '';
    console.log('Search term:', searchTerm); // Confirm search term

    const productsData = await readJsonFile(FILES.products);

    // Check loaded data
    console.log('Total products loaded:', productsData.length);
    console.log('Products data:', productsData);

    if (!Array.isArray(productsData)) {
      console.error('Products data is unavailable or improperly formatted');
      return res.status(500).json({ error: 'Products data is unavailable or improperly formatted' });
    }

    const matchingProducts = productsData
      .filter(product => 
        product.userName?.toLowerCase().includes(searchTerm) ||
        product.bizname?.toLowerCase().includes(searchTerm)
      )
      .map(product => ({
        id: product.productId,
        name: product.name,
        userName: product.userName,
        bizName: product.bizname,
        status: product.status
      }));

    if (matchingProducts.length === 0) {
      res.json({ message: 'No products found' });
    } else {
      res.json(matchingProducts);
    }
  } catch (error) {
    console.error('Error in /api/search-products:', error);
    res.status(500).json({ error: 'Error searching products' });
  }
});



// oijg8g9ugrg g89pugrigrio


app.get('/user-products/:bizname', (req, res) => {
  try {
      const bizname = req.params.bizname;
      
      // Get all approved products
      const allProducts = getProductsFromFile();
      
      // Get users
      const users = getUsersFromFile();
      const user = users.find(u => u.bizname === bizname);
      
      if (!user) {
          console.log(`User not found with bizname: ${bizname}`);
          return res.status(404).render('error.ejs', {
              message: 'Seller shop not found'
          });
      }

      // Filter products by user ID and remove any duplicates
      const userProducts = allProducts
          .filter(product => product.userId === user.id)
          .filter((product, index, self) => 
              index === self.findIndex((t) => t.productId === product.productId)
          );

      // Sort products by date (if available)
      const sortedProducts = userProducts.sort((a, b) => {
          return new Date(b.createdAt || b.lastUpdated) - new Date(a.createdAt || a.lastUpdated);
      });

      res.render('user-products.ejs', {
          user,
          products: sortedProducts,
          formatNumber: (num) => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0"
      });
      
  } catch (error) {
      console.error('Error in user products route:', error);
      res.status(500).render('error.ejs', {
          message: 'Error loading seller shop'
      });
  }
});


// API route to get notifications
app.get('/notifications', ensureAuthenticated, (req, res) => {
  
  const userId = req.user ? req.user.id : req.session.userId;
  
  fs.readFile(notificationsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notifications file:', err);
      return res.render('notifications', { notifications: [], error: 'Error loading notifications' });
    }
    
    let notifications = JSON.parse(data);
    
    const userNotifications = userId ? notifications.filter(notification => notification.userId === userId) : [];
    
    res.render('notifications', { notifications: userNotifications });
  });
});

// API to mark notification as read
app.post('/api/notifications', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await readFileAsync(notificationsFile, 'utf8');
    let notifications = JSON.parse(data);
    
    const userNotifications = notifications.filter(notification => notification.userId === userId);
    
    res.json(userNotifications);
  } catch (error) {
    console.error('Error reading notifications file:', error);
    res.status(500).json({ error: 'Error loading notifications' });
  }
});

app.post('/api/notifications/:id/read', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    const data = await fs.promises.readFile(notificationsFile, 'utf8');
    let notifications = JSON.parse(data);
    
    const notificationIndex = notifications.findIndex(n => n._id === notificationId && n.userId === userId);
    
    if (notificationIndex !== -1) {
      notifications[notificationIndex].read = true;
      await fs.promises.writeFile(notificationsFile, JSON.stringify(notifications, null, 2), 'utf8');
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Error updating notification' });
  }
});

// API to get the unread notification count
app.get('/api/notifications/unread-count', ensureAuthenticated, (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    fs.readFile(notificationsFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading notifications file:', err);
        return res.status(500).json({ error: 'Error loading notifications' });
      }
      
      const notifications = JSON.parse(data);
      
      // Filter notifications by user ID and unread status
      const unreadCount = notifications.filter(n => 
        n.userId === userId && !n.read
      ).length;
      
      res.json({ unreadCount });
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to create a new notification
async function createNotification(userId, message, type) {
  try {
      // Read the notifications file
      const data = fs.readFileSync(notificationsFile, 'utf8');
      let notifications = JSON.parse(data);
      
      // Create new notification object
      const newNotification = {
          _id: generateUniqueId(),  // Make sure you generate a unique ID for each notification
          userId: userId,
          message: message,
          type: type,   // Could be 'approval', 'denial', etc.
          createdAt: new Date().toISOString(),
          read: false
      };

      // Add new notification to the list
      notifications.push(newNotification);

      // Write updated notifications back to the file
      fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2), 'utf8');
  } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
  }
}

// Function to generate unique IDs (you can use a package like `uuid` for this)
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}


// Approve product route
app.post('/approve-product/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
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
      
      // Send notification
    await createNotification(product.userId, `Your product "${product.name}" has been approved!`, 'approval');

      res.json({ success: true, message: 'Product approved successfully and notification sent' });
  } catch (error) {
      console.error('Error approving product:', error);
      res.status(500).send('Error approving product');
  }
});


// Function to reject a product 
app.post('/deny-product/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
      if (!req.user || !req.user.isAdmin) {
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
          return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      const product = pendingProducts[productIndex];
      product.status = 'denied';
      product.denialDate = new Date().toISOString();
      product.denialReason = denialReason;
      
      deniedProducts.push(product);
      pendingProducts.splice(productIndex, 1);
      
      writePendingProductsToFile(pendingProducts);
      writeDeniedProductsToFile(deniedProducts);
      
      // Create a notification for the user who submitted the product
      await createNotification(
          product.userId,
          `Your product "${product.name}" has been denied. Reason: ${denialReason}`,
          'denial'
      );
      
      res.json({ success: true, message: 'Product denied successfully and notification sent' });
  } catch (error) {
      console.error('Error denying product:', error);
      res.status(500).json({ success: false, message: 'Error denying product' });
  }
});

app.post('/api/users/:userId/toggle-status', (req, res) => {
  const userId = req.params.userId;
  const newStatus = req.body.isActive;

  fs.readFile(path.join(__dirname, 'json_folder', 'users.json'), 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading user data:', err);
          return res.status(500).json({ success: false, message: 'Error reading user data' });
      }

      const users = JSON.parse(data);

      if (users[userId]) {
          users[userId].isActive = newStatus;
          fs.writeFile(path.join(__dirname, 'json_folder', 'users.json'), JSON.stringify(users, null, 2), (err) => {
              if (err) {
                  console.error('Error writing user data:', err);
                  return res.status(500).json({ success: false, message: 'Error updating user data' });
              }
              res.json({ success: true, message: 'User status updated successfully' });
          });
      } else {
          res.status(404).json({ success: false, message: 'User not found' });
      }
  });
});


// Helper function to generate URL-friendly business name
function generateUrlFriendlyName(user) {
  if (user.bizname) {
      return user.bizname.replace(/\s+/g, '_').toLowerCase();
  } else if (user.firstname && user.lastname) {
      return `${user.firstname}_${user.lastname}`.toLowerCase();
  } else if (user.firstname) {
      return user.firstname.toLowerCase();
  }
  return `user_${user.id}`;
}

// The my-shop route (updated to use direct business name URLs)
app.get('/my-shop', ensureAuthenticated, (req, res) => {
  try {
      const userId = req.user.id;
      
      // Get products from all files
      const approvedProducts = getProductsFromFile().filter(p => p.userId === userId);
      const pendingProducts = getPendingProductsFromFile().filter(p => p.userId === userId);
      const deniedProducts = getDeniedProductsFromFile().filter(p => p.userId === userId);
      
      // Combine all products
      const allProducts = [
          ...approvedProducts.map(p => ({ ...p, status: 'approved' })),
          ...pendingProducts.map(p => ({ ...p, status: 'pending' })),
          ...deniedProducts.map(p => ({ ...p, status: 'denied' }))
      ];

      // Fetch the current user's data
      const users = getUsersFromFile();
      const currentUser = users.find(u => u.id === userId);
      
      if (!currentUser) {
          throw new Error('User not found');
      }

      // Generate the URL-friendly name
      currentUser.urlFriendlyName = generateUrlFriendlyName(currentUser);

      res.render('my-shop', {
          products: allProducts,
          user: currentUser,
          BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
      });
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Error fetching products');
  }
});


// The direct shop access route - place this AFTER all your specific routes
app.get('/:businessName', (req, res, next) => {  // Added 'next' parameter here
  try {
    const businessName = req.params.businessName;
    
    // List of reserved routes to skip
    const reservedRoutes = ['admin-login', 'admin-logout', 'admin-dashboard', 'my-shop', 'product', 'login', 'register', 'profile', 'brandpage' /* add other routes */];
    
    // If the businessName matches a reserved route, skip to next route handler
    if (reservedRoutes.includes(businessName)) {
      return next();
    }

    const users = getUsersFromFile();
    
    // Find user by matching URL-friendly business name
    const user = users.find(u => {
      const urlFriendlyName = generateUrlFriendlyName(u);
      return businessName === urlFriendlyName;
    });

    if (!user) {
      console.log('Shop not found for:', businessName);
      return res.status(404).send('Shop not found');
    }

    // Fetch only the user's approved products
    const approvedProducts = getProductsFromFile().filter(p => 
      p.userId === user.id && p.status === 'approved'
    );

    // Render the shop page
    res.render('user-products', {
      user,
      products: approvedProducts,
      formatNumber: (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).send('Error fetching shop');
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


// Function to remove a product from a specified JSON file
function removeProductFromAllFiles(productId) {
  const files = [PRODUCTS_FILE, PENDING_PRODUCTS_FILE, DENIED_PRODUCTS_FILE];
  const cleanId = cleanProductId(productId);
  
  if (!cleanId) {
      console.error('Invalid product ID provided for removal');
      return false;
  }
  
  let removedFromAny = false;
  
  files.forEach(filePath => {
      try {
          ensureFileExists(filePath);
          const content = fs.readFileSync(filePath, 'utf8');
          let data = JSON.parse(content);
          
          if (filePath === PRODUCTS_FILE) {
              // Handle products.json special structure
              if (data.products && Array.isArray(data.products)) {
                  const originalLength = data.products.length;
                  data.products = data.products.filter(p => p.productId !== cleanId);
                  
                  if (data.products.length !== originalLength) {
                      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                      removedFromAny = true;
                  }
              }
          } else {
              // Handle other files (array structure)
              if (Array.isArray(data)) {
                  const originalLength = data.length;
                  data = data.filter(p => p.productId !== cleanId);
                  
                  if (data.length !== originalLength) {
                      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                      removedFromAny = true;
                  }
              }
          }
      } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
      }
  });
  
  if (!removedFromAny) {
      console.warn(`Product ${cleanId} was not found in any file`);
  }
  
  return removedFromAny;
}

// DELETE route to remove a product (For users form my-shop)
app.delete('/delete-product/:id', (req, res) => {
  const productId = req.params.id;

  // Paths to JSON files
  const productsPath = path.join(__dirname, 'json_folder', 'products.json');
  const pendingProductsPath = path.join(__dirname, 'json_folder', 'pending_products.json');
  const deniedProductsPath = path.join(__dirname, 'json_folder', 'denied_products.json');

  // Function to remove product from a file
  const deleteProduct = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${filePath}:`, err);
          return reject(err);
        }

        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (parseErr) {
          console.error(`Error parsing JSON from file ${filePath}:`, parseErr);
          return reject(parseErr);
        }

        // Handle both cases: [] or { products: [] }
        let productsArray;
        if (Array.isArray(parsedData)) {
          productsArray = parsedData; // File is an array
        } else if (parsedData && parsedData.products && Array.isArray(parsedData.products)) {
          productsArray = parsedData.products; // File is { products: [] }
        } else {
          console.error(`Unexpected format in file ${filePath}`);
          return reject(new Error('Invalid file format'));
        }

        // Filter the product by productId
        const updatedProducts = productsArray.filter(product => product.productId !== productId);

        // Update the structure based on the original format
        let updatedData;
        if (Array.isArray(parsedData)) {
          updatedData = JSON.stringify(updatedProducts, null, 2); // Save as array
        } else {
          updatedData = JSON.stringify({ products: updatedProducts }, null, 2); // Save as { products: [] }
        }

        fs.writeFile(filePath, updatedData, 'utf-8', (writeErr) => {
          if (writeErr) {
            console.error(`Error writing file ${filePath}:`, writeErr);
            return reject(writeErr);
          }
          console.log(`Product deleted successfully from ${filePath}`);
          resolve();
        });
      });
    });
  };

  // Remove from all files
  Promise.all([
    deleteProduct(productsPath),
    deleteProduct(pendingProductsPath),
    deleteProduct(deniedProductsPath)
  ])
  .then(() => {
    console.log(`Product ${productId} deleted from all files.`);
  })
  .catch(err => {
    console.error(`Error deleting product with ID ${productId}:`, err);
    res.status(500).json({ success: false, message: 'Error deleting product', error: err });
  });

  // Return a JSON response to the client
  return res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

//Submit-product route
app.post("/submit-product", upload.array('photos', 4), async (req, res) => {
  try {
      console.log('=== Starting product submission ===');
      
      // Ensure user is authenticated
      if (!req.session.userId) {
          return res.status(401).json({
              success: false,
              error: 'User must be logged in to submit products'
          });
      }

      // Clone req.body and normalize the boost option
      const productData = {
          ...req.body,
          userId: req.session.userId, // Add userId to product data
          boostOption: Array.isArray(req.body.boostOption) 
              ? req.body.boostOption[0] 
              : req.body.boostOption
      };

      // Handle file uploads with proper path formatting
      if (req.files && req.files.length > 0) {
          productData.photos = req.files.map(file => `/uploads/${file.filename}`);
      }

      const rawProductId = productData.productId;
      const cleanId = cleanProductId(rawProductId);
      
      // For new products
      if (!rawProductId) {
          await handleNewProduct(productData, req, res);
          return;
      }
      
      // For existing products
      if (cleanId) {
          await handleExistingProduct(productData, cleanId, res);
      } else {
          await handleNewProduct(productData, req, res);
      }
  } catch (error) {
      console.error('Error in submit-product route:', error);
      res.status(500).json({
          success: false,
          error: 'Failed to submit product',
          details: error.message
      });
  }
});

// Update the handleNewProduct function to ensure proper handling of photos
async function handleNewProduct(productData, req, res) {
  try {
      // Generate new UUID if not exists
      productData.productId = productData.productId || uuidv4();

      // Format year data
      if (!productData.year) {
          productData.year = productData.yearOption === 'single'
              ? productData.year
              : `${productData.startYear}-${productData.endYear}`;
      }

      // Ensure photos array exists and is properly formatted
      if (req.files && req.files.length > 0) {
          productData.photos = req.files.map(file => `/uploads/${file.filename}`);
      } else {
          productData.photos = [];
      }

      // Fix boost option handling
      const boostOption = Array.isArray(productData.boostOption) 
          ? productData.boostOption[0] 
          : productData.boostOption;
      
      // Set product status and add user ID
      productData.status = boostOption === 'no-bst' ? 'pending' : 'pending_payment';
      productData.userId = req.session.userId;

      if (boostOption === 'no-bst') {
          try {
              const success = await addToPendingProducts({
                  ...productData,
                  boostOption: boostOption,
                  createdAt: new Date().toISOString(),
                  lastUpdated: new Date().toISOString()
              });

              if (success) {
                  return res.json({
                      success: true,
                      message: 'Your product has been submitted successfully. Review will be done within 24 hours.',
                      productId: productData.productId,
                      status: productData.status,
                      photos: productData.photos
                  });
              }
          } catch (error) {
              console.error('Failed to save to pending products:', error);
              throw error;
          }
      } else {
          // Handle paid boosts
          req.session.pendingProductData = {
              ...productData,
              boostOption: boostOption
          };
          const paymentAmount = calculatePaymentAmount(boostOption);
          const paymentUrl = createPaymentGatewayURL(productData.productId, paymentAmount);
          
          return res.json({
              success: true,
              redirectUrl: paymentUrl,
              productId: productData.productId
          });
      }
  } catch (error) {
      console.error('Error in handleNewProduct:', error);
      throw error;
  }
}

// Function to handle existing product update
function cleanProductId(productId) {
  if (!productId) return null;
  
  // Handle array of IDs
  if (Array.isArray(productId)) {
      productId = productId[0]; // Take the first ID from the array
  }
  
  // Handle string IDs
  if (typeof productId === 'string') {
      return productId.split(',')[0].trim();
  }
  
  return null;
}

// Updated handleExistingProduct function with better product finding logic
async function handleExistingProduct(productData, rawProductId, res) {
  try {
      const productId = cleanProductId(rawProductId);
      if (!productId) {
          throw new Error(`Invalid product ID format: ${rawProductId}`);
      }

      // Initialize variables to track product location
      let foundProduct = null;
      let sourceFile = null;
      const fileContents = {};

      // Read all files and search for the product
      for (const [key, filepath] of Object.entries(FILES)) {
          const products = await readJsonFile(filepath);
          fileContents[key] = products;
          
          const product = products.find(p => p.productId === productId);
          if (product) {
              foundProduct = product;
              sourceFile = key;
              console.log(`Found product in ${key} file`);
              break;
          }
      }

      if (!foundProduct || !sourceFile) {
          console.error('Product not found in any file. Available products:', 
              Object.entries(fileContents).map(([key, products]) => 
                  `${key}: ${products.length} products`
              ).join(', ')
          );
          throw new Error(`Product not found with ID: ${productId}`);
      }

      // Update product data
      const updatedProduct = {
          ...foundProduct,
          ...productData,
          productId,
          status: 'pending',
          lastUpdated: new Date().toISOString()
      };

      // Remove product from source file
      const sourceProducts = fileContents[sourceFile];
      const filteredProducts = sourceProducts.filter(p => p.productId !== productId);
      await writeJsonFile(FILES[sourceFile], filteredProducts);
      console.log(`Removed product from ${sourceFile} file`);

      // Add to pending products
      await addToPendingProducts(updatedProduct);

      res.json({
          success: true,
          message: 'Product updated successfully. Review would be done within 24 hrs',
          productId: updatedProduct.productId,
          status: updatedProduct.status,
          photos: updatedProduct.photos,
          sourceFile // Include the source file information in response
      });

  } catch (error) {
      console.error('Error handling existing product:', error);
      res.status(500).json({
          success: false,
          error: error.message,
          details: 'Please ensure the product ID is correct and try again.'
      });
  }
}

app.get('/debug/check-product/:id', async (req, res) => {
  try {
      const fileContent = fs.readFileSync(FILES.pending, 'utf8');
      const pendingProducts = JSON.parse(fileContent);
      const product = pendingProducts.find(p => p.productId === req.params.id);
      res.json({
          found: !!product,
          product: product || null,
          totalProducts: pendingProducts.length
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/debug/boost-check/:id', async (req, res) => {
  try {
      const fileContent = fs.readFileSync(FILES.pending, 'utf8');
      const pendingProducts = JSON.parse(fileContent);
      const product = pendingProducts.find(p => p.productId === req.params.id);
      res.json({
          found: !!product,
          boostOption: product?.boostOption,
          status: product?.status,
          product: product || null
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate payment amount
function calculatePaymentAmount(boostOption) {
    const prices = {
        'std-bst': 29.99,  // Standard boost price
        'prm-bst': 49.99   // Premium boost price
    };
    return prices[boostOption] || 0;
}

// Helper function to create payment gateway URL
function createPaymentGatewayURL(productId, amount) {
    // Replace this with your actual payment gateway URL construction
    const baseUrl = process.env.PAYMENT_GATEWAY_URL || 'https://your-payment-gateway.com';
    return `${baseUrl}/checkout?amount=${amount}&product_id=${productId}&redirect_url=${encodeURIComponent(process.env.BASE_URL + '/return-from-payment')}`;
}

// Return from payment gateway route
app.get('/return-from-payment', async (req, res) => {
    try {
        const pendingProductData = req.session.pendingProductData;
        
        if (!pendingProductData) {
            throw new Error('No pending product data found');
        }

        // Verify payment status from payment gateway
        const paymentStatus = await verifyPaymentStatus(req.query);
        
        if (paymentStatus.success) {
            // Update product status and save
            pendingProductData.status = 'pending';
            pendingProductData.paymentComplete = true;
            pendingProductData.paymentDate = new Date().toISOString();
            
            addToPendingProducts(pendingProductData);
            
            // Clear session data
            delete req.session.pendingProductData;
            
            res.redirect('/sell-product?status=success');
        } else {
            res.redirect('/sell-product?status=payment_failed');
        }
    } catch (error) {
        console.error('Error processing payment return:', error);
        res.redirect('/sell-product?status=error');
    }
});

// Helper function to verify payment status
async function verifyPaymentStatus(queryParams) {
    // Replace this with your actual payment verification logic
    // This should communicate with your payment gateway to verify the transaction
    return { success: true }; // Placeholder response
}

app.get("/api/product/:id", (req, res) => {
  try {
    const productId = req.params.id;
    const products = getProductsFromFile();
    const pendingProducts = getPendingProductsFromFile();
    const deniedProducts = getDeniedProductsFromFile();
    
    // Search in all three files
    const product = products.find(p => p.productId === productId) ||
                   pendingProducts.find(p => p.productId === productId) ||
                   deniedProducts.find(p => p.productId === productId);
    
    if (product) {
      // Add source information to help with tracking
      let source = 'approved';
      if (pendingProducts.find(p => p.productId === productId)) {
        source = 'pending';
      } else if (deniedProducts.find(p => p.productId === productId)) {
        source = 'denied';
      }
      
      res.json({
        ...product,
        source
      });
    } else {
      console.log(`Product not found with ID: ${productId}`);
      console.log(`Searched in: 
        - Approved products: ${products.length} items
        - Pending products: ${pendingProducts.length} items
        - Denied products: ${deniedProducts.length} items`);
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//View details of product as admin
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    console.error('ProductId is undefined or null');
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const productsFilePath = path.join(__dirname, 'json_folder', 'products.json');
 
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading or parsing products JSON:', err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    const jsonData = JSON.parse(data);
    
    if (!jsonData.products || !Array.isArray(jsonData.products)) {
      console.error('Invalid products data structure');
      return res.status(500).json({ message: 'Internal server error', error: 'Invalid data structure' });
    }
    
   
    const product = jsonData.products.find(p => p.productId === productId);
   
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    } 
    res.json(product);
  });
});

                                                                                                
//Managing Admin Login
// Add this function to check if a user is an admin
function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.redirect('/admin-login');
}

app.get('/admin-login', (req, res) => {
  res.render('admin-login.ejs', { message: req.flash('error')[0] });
});

app.post('/admin-login', (req, res, next) => {
passport.authenticate('local', (err, user, info) => {
  if (err) { return next(err); }
  if (!user) {
    req.flash('error', 'Invalid username or password');  // Set error message
    return res.redirect('/admin-login');
  }
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

// Admin logout route
app.get('/admin-logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.isAdmin = false; // Clear the admin session flag
    res.redirect('/admin-login'); // Redirect to admin login page
  });
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