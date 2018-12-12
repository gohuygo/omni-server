const express = require('express')
const models  = require('./db/models/index');
const bcrypt  = require('bcrypt');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080

const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/users', async (req, res) => {
  let encryptedPassword = await bcrypt.hash(req.body.password, 10);
  console.log(req.body.password, encryptedPassword);
  models.user.create({
    email: req.body.email,
    name: req.body.name,
    password: encryptedPassword,
  })
})

app.listen(port, () => {
 console.log(`Server listening on port: ${port}`)
})

