const express = require('express');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const profileRoutes = require('./routes/profile');
const path = require('path');
const helmet = require("helmet");
const database = require('./models/data-base');

require('dotenv').config()


database.connect(function(err) {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");
});


const app = express();

app.use(helmet());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());


app.use('/api/post', postRoutes);

app.use('/api/profile', profileRoutes);

app.use('/api/auth', userRoutes);


module.exports = app;