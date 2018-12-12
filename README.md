## Server

  Server is hosted on Heroku - https://floating-hamlet-63452.herokuapp.com

### Installation

1. Install the dependencies:

  `npm install`

2. Update config/database.json with your db settings and create your db:

  `sequelize db:create`

3. Run migrations:

  `sequelize db:migrate`

4. Start the node server:

  `node app.js`

### Deployment

1. Add the Heroku remote:

  `git remote add heroku https://git.heroku.com/floating-hamlet-63452.git`

2. Push your changes to Heroku:

  `git push heroku master`
