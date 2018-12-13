const express = require('express')
const models  = require('./db/models/index');
const bcrypt  = require('bcrypt');
const bodyParser = require('body-parser');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = models.user;
const router = express.Router();

// TODO: Change and move to env variable
const secret = "hello1234"

const passportConfig = require('./passport.js');

const port = process.env.PORT || 8080

const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      res.status(400).json({ error });
    }

    // Construct JWT payload
    const payload = {
      email: user.email,
      expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
    };

    // Assign payload to req.user
    req.login(payload, {session: false}, (error) => {
      if (error) {
        res.status(400).send({ error });
      }

      // Generate a signed JWT
      const token = jwt.sign(JSON.stringify(payload), secret);

      // Assign JWT to cookie
      res.cookie('jwt', jwt, { httpOnly: true, secure: true });
      res.status(200).send({ email: user.email });
    });
  })(req, res);
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // authentication will take approximately 13 seconds
  // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
  const hashCost = 10;

  try {
    const passwordHash = await bcrypt.hash(password, hashCost);
    const userDocument = User.create({ email: email, password: passwordHash });

    res.status(200).send({ email });

  } catch (error) {
    res.status(400).send({
      error: 'req body should take the form { email, password }',
    });
  }
});


app.listen(port, () => {
 console.log(`Server listening on port: ${port}`)
})

