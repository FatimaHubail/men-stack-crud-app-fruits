const Fruit = require('../models/fruit');

const index = async (req, res) => {
    try {
        const foundFruits = await Fruit.find();
        res.render("fruits/index.ejs", { fruits: foundFruits });
    } catch (error) {
        res.send('failed to get all fruits');
    }
};

const home = async (req, res) => {
    res.render("index.ejs");
};

const create = async (req, res) => {
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
}

const show = async (req, res) => {
    try {
        const fruit = await Fruit.findById(req.params.id);
        res.render("fruits/show.ejs", { fruit });
    } catch (error) {
        console.log('failed to fetch the fruit');
    }
};

const deleteFruit = async (req, res) => {
    try {
        await Fruit.findByIdAndDelete(req.params.id);
        res.redirect("/fruits");
    } catch (error) {
        res.send('unable to delete fruit');
    }
};

const edit = async (req, res) => {
    try {
        const fruit = await Fruit.findById(req.params.id);
        res.render('fruits/edit.ejs', { fruit });
    } catch (error) {
        res.send('unable to update the fruit');
    }
};

const update = async (req, res) => {
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
};

const showNewForm = (req, res) => {
    res.render('fruits/new.ejs');
};

module.exports = {
    home,
    showNewForm,
    create,
    index,
    show,
    delete: deleteFruit,
    edit,
    update
};
