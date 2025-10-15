import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/user.js"
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}
));
export default passport;