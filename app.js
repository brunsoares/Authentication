require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = express();
const saltRounds = 10;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/secretsDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const emailRegister = req.body.username;
    const passRegister = req.body.password;

    bcrypt.hash(passRegister, saltRounds, function(err, hash) {
        if(!emailRegister || !passRegister){
            res.render("register");
        } else {
            const newUser = new User({
                email: emailRegister,
                password: hash
            });
    
            newUser.save().then(() => console.log("New user successfully saved!"));
            res.render("secrets");
        }
    });
    
});

app.post("/login", function(req, res){
    const emailLogin = req.body.username;
    const passLogin = req.body.password;

    if(!emailLogin || !passLogin){
        res.render("login");
    } else {
        User.findOne({ email: emailLogin }).then(function(user){
            bcrypt.compare(passLogin, user.password, function(err, result) {
                if(result == true){
                    res.render("secrets");
                } else {
                    console.log("Incorrect username or password!")
                    res.render("login");
                }
            });
        });
    }
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});
