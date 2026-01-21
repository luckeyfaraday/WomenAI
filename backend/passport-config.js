const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            const existingUser = await db.query(
                'SELECT * FROM users WHERE google_id = $1',
                [profile.id]
            );

            if (existingUser.rows.length > 0) {
                // User exists, return it
                return done(null, existingUser.rows[0]);
            }

            // Create new user
            const newUser = await db.query(
                `INSERT INTO users (google_id, email, name, picture) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
                [
                    profile.id,
                    profile.emails[0].value,
                    profile.displayName,
                    profile.photos[0]?.value
                ]
            );

            done(null, newUser.rows[0]);
        } catch (err) {
            done(err, null);
        }
    }
));

// Serialize user to session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
