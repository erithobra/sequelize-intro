const users = require('../models/users');

const index = (req, res) => {
    res.render('users/index.ejs')//views/users/index.ejs
}

const renderSignup = (req, res) => {
    res.render('users/signup.ejs')
}

const signup = (req, res) => {
    users.push(req.body);
    res.redirect(`/users/profile/${users.length-1}`);
}

const renderLogin = (req, res) => {
    res.render('users/login.ejs')
}

const login = (req, res) => {
    let index = users.findIndex(
        user => (user.username === req.body.username && 
                    user.password === req.body.password)
    )

    res.redirect(`/users/profile/${index}`);
}

const renderProfile = (req, res) => {
    res.render('users/profile.ejs', {
        user: users[req.params.index],
        index: req.params.index
    })
}

const editProfile = (req, res) => {
    users[req.params.index] = req.body;
    res.redirect(`/users/profile/${req.params.index}`);
}

const deleteUser = (req, res) => {
    users.splice(req.params.index, 1);
    res.redirect('/users');
}

module.exports = {
    index,
    renderSignup,
    signup,
    renderProfile,
    renderLogin,
    login,
    editProfile,
    deleteUser
}