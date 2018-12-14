require('dotenv').config()

const express = require('express')
const models  = require('./db/models/index');
const bcrypt  = require('bcrypt');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser')

const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = models.user;
const router = express.Router();

require('./passport.js');

const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/login', (req, res) => {
  console.log(req)
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      res.status(400).json({ error });
    }

    // Construct JWT payload with 10 minute expiration
    const payload = {
      email: user.email,
      expires: Date.now() + parseInt(60000*10),
    };

    // Assign payload to req.user
    req.login(payload, {session: false}, (error) => {
      if (error) {
        res.status(400).send({ error });
      }
      // Generate a signed JWT
      const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);

      // Assign JWT to cookie
      res.cookie('jwt', token, { httpOnly: true, secure: false });
      res.status(200).send({ email: user.email, jwt: token });
    });
  })(req, res);
});

app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userDocument = User.create({ email: email, password: passwordHash, name: name });

    res.status(200).send({ email });

  } catch (error) {
    res.status(400).send({
      error: 'req body should take the form { email, password }',
    });
  }
});


app.listen(process.env.PORT, () => {
 console.log(`Server listening on port: ${process.env.PORT}`)
})

