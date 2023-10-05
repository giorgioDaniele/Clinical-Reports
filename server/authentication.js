"use strict"

const passport      = require("passport");
const session       = require("express-session");
const LocalStrategy = require("passport-local").Strategy

const FORBIDDEN = 401

/**
 * Helper function to initialize passport authentication with the LocalStrategy
 *
 * @param app express app
 * @param database instance of an active Database object
 */
function initAuthentication(app, database) {

// INIT PASSPORT
    passport.use(new LocalStrategy(
        function(username, password, done) {
            database.getUser(username, password).then((user) => {
                if (!user) return done(null, false, { message: 'Incorrect username and/or password.' })
                return done(null, user)
            })
        }
    ))

    // SERIALIZE AND DE-SERIALIZE THE USER (USER AN OBJECT <-> SESSION)
    // I SERIALIZE THE USER ID AND I STORE IT IN THE SESSION
    passport.serializeUser((user, done) => done(null, user.ID))


    // STARTING FROM THE DATA IN THE SESSION, I EXTRACT THE CURRENT (LOGGED-IN) USER
    passport.deserializeUser((id, done) =>
            database.getUserByID(id).then(user => done(null, user)).catch(err => done(err, null))
            /* THIS WILL BE AVAILABLE IN request.user */
    )

    // Initialize express-session
    app.use(session({
        secret: "586e60fdeb6f34186ae165a0cea7ee1dfa4105354e8c74610671de0ef9662191",
        resave: false,
        saveUninitialized: false
    }));

    // Initialize passport middleware
    app.use(passport.initialize());
    app.use(passport.session());
}

/**
 * Express middleware to check if the user is authenticated.
 * Responds with a 401 Unauthorized in case they're not.
 */
function isAuthenticated (request, response, next) {
    if(request.isAuthenticated())
        return next()
    return response.status(FORBIDDEN).json({error: 'You are not authenticated'})
}


module.exports = { initAuthentication, isAuthenticated };