// https://medium.com/front-end-hacking/learn-using-jwt-with-passport-authentication-9761539c4314
const passport = require('passport’);

const LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy({usernameField: 'email', passwordField: 'password'},
  function (email, password, cb) {
    return UserModel.findOne({email, password})
       .then(user => {
           if (!user) {
               return cb(null, false, {message: 'Incorrect email or password.'});
           }
           return cb(null, user, {message: 'Logged In Successfully'});
      })
      .catch(err => cb(err));
  }
));
