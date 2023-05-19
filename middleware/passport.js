const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const initPassport = (app) => {
    app.use(passport.initialize());

    passport.use(new JwtStrategy({
        secretOrKey: process.env.TOKEN_SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, async (token, done) => {
        try {
            if (!token.user) {
                return done(null, false, {message: 'Incorrect username or password.'});
            }
            return done(null, token.user);
        } catch (error) {
            return done(error);
        }
    }));

}

module.exports = {
    initPassport
};
