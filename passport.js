const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const bcrypt = require('bcrypt')

// TODO: Change and move to env variable
const secret = "hello1234"

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
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: secret,
  },
  (jwtPayload, done) => {

    if (jwtPayload.expires > Date.now()) {
      return done('jwt expired')
    }

    return done(null, jwtPayload)
  }
))
