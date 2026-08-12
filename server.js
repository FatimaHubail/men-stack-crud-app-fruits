const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Fruit = require('./models/fruit.js');
const morgan = require('morgan');

dotenv.config();
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// DB connection
const connect = async () => {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Connected to MongoDB');
}
connect();

// index
app.get('/', (req, res) => {
    res.render("index.ejs");
})

// add new fruit form
app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs');
});

// sending 'create' form data
app.post('/fruits', async (req, res) => {
    try {
        if (req.body.isReadyToEat === "on") {
            req.body.isReadyToEat = true;
        } else {
            req.body.isReadyToEat = false;
        }
        await Fruit.create(req.body);
        res.redirect("/fruits/new");
    } catch (error) {
        console.log('error');
    }
})

app.get('/fruits', async (req, res) => {
    try {
        const allFruits = await Fruit.find();
        res.render("fruits/index.ejs", { fruits: allFruits });
    } catch (error) {
        res.send('failed to get all fruits');
    }
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});