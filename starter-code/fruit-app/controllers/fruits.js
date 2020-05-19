const fruits = require('../models/fruits.js')

const index = (req, res) => {
    res.render('index.ejs', {
        fruits : fruits
    });
};

const show = (req, res) => {
    res.render('show.ejs', {
        fruit: fruits[req.params.index]
    });
}

const renderNew = (req, res) => {
    res.render('new.ejs');
}

const postFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true; //do some data correction
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false; //do some data correction
    }
    fruits.push(req.body);
    
    res.redirect('/fruits');
}

const renderEdit = (req, res) => {
    res.render(
		'edit.ejs', //render views/edit.ejs
		{ //pass in an object that contains
			fruit: fruits[req.params.index], //the fruit object
			index: req.params.index //... and its index in the array
		}
	);
}

const editFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
	fruits[req.params.index] = req.body; //in our fruits array, find the index that is specified in the url (:index).  Set that element to the value of req.body (the input data)
	res.redirect('/fruits'); //redirect to the index page
}

const deleteFruit = (req, res) => {
    fruits.splice(req.params.index, 1); //remove the item from the array
	res.redirect('/fruits');  //redirect back to index route
}
  
module.exports = {
    index,
    renderNew,
    postFruit,
    show,
    renderEdit,
    editFruit,
    deleteFruit
  };