const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const bcrypt = require('bcrypt')

const User = require('./db/models/index').user;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: {email: email} })
    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (passwordsMatch) {
      return done(null, user)
    } else {
      return done('Incorrect Email / Password')
    }
  } catch (error) {
    done(error)
  }
}))

passport.use(new JWTStrategy({
  jwtFromRequest: req => {console.log(req, req.cookies); req.cookies.jwt},
  secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, done) => {
  console.log("JWT STRAT")
  console.log(jwtPayload)
  if (Date.now() > jwtPayload.expires) {
    return done('Access token is expired')
  }
  return done(null, jwtPayload)
}))
