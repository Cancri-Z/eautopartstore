// utils/passport-config.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { getUsersFromFile } = require('./userUtils');


function initializePassport(passport) {
    const authenticateUser = async (email, password, done) => {
        const users = getUsersFromFile();
        const user = users.find(user => user.email === email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        const users = getUsersFromFile();
        return done(null, users.find(user => user.id === id));
    });
}

module.exports = initializePassport;