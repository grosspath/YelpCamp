require("dotenv").config();

const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      Campground     = require("./models/campground"),
      Comment        = require("./models/comment"),
      User           = require("./models/user"),
      flash          = require("connect-flash"),
      seedDB         = require("./seeds");
      
      const url = "mongodb://localhost/yelp_camp_v2";


//requiring routes
const commentRoutes    = require("./routes/comment");
const campgroundRoutes = require("./routes/campgrounds");
const indexAuthRoutes       = require("./routes/index");

//seedDB(); //seed database
mongoose.connect(url); //changed the db to point to v2 instead of yelp_camp
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//Passport config
app.use(require("express-session")({
    secret: "Grover Tanner",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexAuthRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp has started');
});