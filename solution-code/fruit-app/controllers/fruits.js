const fruits = require('../fruits');//imported fruits array

const Fruit = require('../models').Fruit; // import Fruit model

//handle index request
const index = (req, res) => {
    Fruit.findAll()//return a promise object
    .then(allFruits => { //if success store fruits in fruits variable
        res.render('index.ejs', {//render template
            fruits: allFruits//pass along all the fruits in the Fruits table
        });
    })
    // res.render('index.ejs', {
    //     fruits: fruits
    // });
}

const show = (req, res) => {
    Fruit.findByPk(req.params.index)
    .then(foundFruit => {
        res.render('show.ejs', {
            fruit: foundFruit
        });
    })

    // let f = fruits[req.params.index];
    // res.render('show.ejs', { //second param must be an object
    //     fruit: f
    // });
}

const renderNew = (req, res) => {
    res.render('new.ejs');
}

const postFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else{
        req.body.readyToEat = false;
    }

    Fruit.create(req.body)
    .then(newFruit => {
        res.redirect('/fruits');
    })

    //saving fruit object in fruits array
    // fruits.push(req.body);

    // console.log(fruits);
    // res.redirect('/fruits');
}

const removeFruit = (req, res) => {
    Fruit.destroy({
        where: {id: req.params.index}
    })
    .then(() => {
        res.redirect('/fruits')
    })

    // fruits.splice(req.params.index, 1);
    // res.redirect('/fruits');
}

const renderEdit = (req, res) => {
    Fruit.findByPk(req.params.index)
    .then(foundFruit => {
        res.render('edit.ejs', {
            fruit: foundFruit
        })
    })
    // res.render('edit.ejs', {
    //     fruit: fruits[req.params.index],
    //     index: req.params.index
    // })
}

const editFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else{
        req.body.readyToEat = false;
    }

    Fruit.update(req.body, {
        where: {id: req.params.index},
        returning: true//update to send back the updated Fruit object
    })
    .then(updatedFruit => {
        res.redirect('/fruits');
    })

    // fruits[req.params.index] = req.body;
    // res.redirect('/fruits');
}

module.exports = {
    index,
    show,
    renderNew,
    postFruit,
    removeFruit,
    renderEdit,
    editFruit
}