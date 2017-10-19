//jshint esversion:6

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const port = process.env.port || 8080;
const db = require('./models');
const Photo = db.photo;

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname:'.hbs'
}));

app.set('view engine', '.hbs');

app.post('/gallery', (req, res) => {
  const author = req.body.author;
  const link = req.body.link;
  const description = req.body.description;

  return Photo.create({ author: author, link: link, description: description})
    .then(newPhoto => {
      return res.json(newPhoto);
    });
});

app.listen(port, () => {
  db.sequelize.sync({ force: false });
  console.log(`Server listening on port: '${port}`);
});
