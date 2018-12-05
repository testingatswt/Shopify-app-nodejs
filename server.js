const express = require('express');
const app = express();
require('dotenv').config();
const indexRoute = require('./routes/Index');
const shopifyRoute = require('./routes/Shopify');
const mongoose = require('mongoose');
app.set('port', process.env.PORT);

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected")
});


app.listen(app.get('port'), () => {
    console.log(`Server started on port`, app.get('port'));
});

app.use('/', indexRoute);
app.use('/install', shopifyRoute);

app.get('*', (req, res, next) => {
    res.send("404 not found!");
});