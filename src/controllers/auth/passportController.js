'use strict'
import passport from 'passport';
import googleStrategy from 'passport-google-oauth2';
import authService from '../../services/auth/authService';
import tokenService from '../../services/token/tokenService';
import onRemoveParams from '../../utils/remove-params';
const GoogleStrategy = googleStrategy.Strategy;

function createUrlParams(obj) {
  const params = new URLSearchParams();

  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          params.append(key, obj[key]);
      }
  }

  return params.toString();
}

const passportController = {
  authenticateByGoogle: (req, res, next) => {
    passport.authenticate('google',  {
      scope: ['email', 'profile']
    })(req, res, next);
  },
  authenticateCallback: (req, res, next) => {
    passport.authenticate('google', {
      failureRedirect: `${process.env.BASE_URL_CLIENT}/login?status=error&message=login_with_google_failed`
    },async () => {
      const email = req.userProfile.email;
      const name = req.userProfile.name;
      const avatar = req.userProfile.avatar;
      const rs = await authService.loginByGoogle(email, name, avatar);
      const accessToken = tokenService.generateToken(rs.data);
      const params = createUrlParams(onRemoveParams(rs.data));
      res.redirect(`${process.env.BASE_URL_CLIENT}/login-google?status=success&${params}&accessToken=${accessToken}`);
    })(req, res, next);
  }
}

export default passportController;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL_SERVER}/v1/auth/google/callback`,
  passReqToCallback: true
},(req,accessToken,refreshToken,profile,done) => {
  const email = profile.email;
  const name = profile.displayName;
  const avatar = profile.picture;
  req.userProfile = { email, name, avatar };
  return done(null, profile);
}))
