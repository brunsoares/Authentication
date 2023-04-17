require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encryption = require('mongoose-encryption');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/secretsDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisasecrettobdpassword";
userSchema.plugin(encryption, { secret: process.env.SECRET, encryptedFields: ["password"]});


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

    if(!emailRegister || !passRegister){
        res.render("register");
    } else {
        const newUser = new User({
            email: emailRegister,
            password: passRegister
        });

        newUser.save().then(() => console.log("New user successfully saved!"));
        res.render("secrets");
    }
});

app.post("/login", function(req, res){
    const emailLogin = req.body.username;
    const passLogin = req.body.password;

    if(!emailLogin || !passLogin){
        res.render("login");
    } else {
        User.findOne({ email: emailLogin }).then(function(user){
            if(user.password == passLogin){
                res.render("secrets");
            } else {
                console.log("Incorrect username or password!")
                res.render("login");
            }
        });
    }
});









app.listen(3000, function(){
    console.log("Server started on port 3000");
});
