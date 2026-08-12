const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Fruit = require('./models/fruit.js');

dotenv.config();
const app = express();
const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}
connect();

app.get('/', (req, res) => {
    res.render("index.ejs");
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});