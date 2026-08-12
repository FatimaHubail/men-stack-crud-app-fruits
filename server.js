const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Fruit = require('./models/fruit.js');
const morgan = require('morgan');
const path = require('path');
const override = require('method-override');

dotenv.config();
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(override("_method"))
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));

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
});

// rendering all fruits
app.get('/fruits', async (req, res) => {
    try {
        const allFruits = await Fruit.find();
        res.render("fruits/index.ejs", { fruits: allFruits });
    } catch (error) {
        res.send('failed to get all fruits');
    }
});

// show single fruit info
app.get('/fruits/:id', async (req, res) => {
    try {
        const fruit = await Fruit.findById(req.params.id);
        res.render("fruits/show.ejs", { fruit });
    } catch (error) {
        console.log('failed to fetch the fruit');
    }
})

// delete fruit
app.delete('/fruits/:id', async (req, res) => {
    try {
        await Fruit.findByIdAndDelete(req.params.id);
        res.redirect("/fruits");
    } catch (error) {
        res.send('unable to delete fruit');
    }
})

// edit fruit
app.get('/fruits/:id/edit', async (req, res) => {
    try {
        const fruit = await Fruit.findById(req.params.id);
        res.render('fruits/edit.ejs', { fruit });
    } catch (error) {
        res.send('unable to update the fruit');
    }
})

app.put('/fruits/:id', async (req, res) => {
    try {
        if (req.body.isReadyToEat === "on") {
            req.body.isReadyToEat = true;
        } else {
            req.body.isReadyToEat = false;
        }
        await Fruit.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/fruits/${req.params.id}`); 
    } catch (error) {
        console.log(error);
        res.send('Coun')
    }
})
app.listen(3000, () => {
    console.log('Listening on port 3000');
});