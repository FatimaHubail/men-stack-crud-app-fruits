const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Fruit = require('./models/fruit.js');
const morgan = require('morgan');
const path = require('path');
const override = require('method-override');
const fruitsCtrl = require('./controllers/fruitsCtrl');


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

app.get('/', fruitsCtrl.home);
app.get('/fruits/new', fruitsCtrl.showNewForm);
app.post('/fruits', fruitsCtrl.create);
app.get('/fruits', fruitsCtrl.index);
app.get('/fruits/:fruitId', fruitsCtrl.show);
app.delete('/fruits/:fruitId', fruitsCtrl.delete);
app.get('/fruits/:fruitId/edit', fruitsCtrl.edit);
app.put('/fruits/:fruitId', fruitsCtrl.update);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});