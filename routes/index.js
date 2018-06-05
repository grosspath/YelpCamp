const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");


//root route
router.get("/", function(req, res){
    res.render("landing");
});




//===========
//Auth routes
//===========

//show register form
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

//handle sign up logic
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully signed up! Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

//handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;