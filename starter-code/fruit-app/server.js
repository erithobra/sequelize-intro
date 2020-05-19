const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();//app is an object
const routes = require('./routes');

app.use(bodyParser.urlencoded({extended:false}));

app.use(methodOverride('_method'));

app.use('/fruits', routes.fruits)

app.listen(3000, ()=>{
    console.log("listening");
});
