const express      = require("express");
const router       = express.Router();
const Campground   = require("../models/campground");
const middleware   = require("../middleware");
const NodeGeocoder = require("node-geocoder");

let options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

let geocoder = NodeGeocoder(options);

//INDEX show all campgrounds
router.get("/campgrounds", function(req, res){
    //Get all campgrounds from db
    
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: "campgrounds"});
        }
    });
    
});

//NEW
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//CREATE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    // redirect back to campgrounds "get" page
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.desc;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    
    geocoder.geocode(req.body.location, function(err, data){
        if(err || !data.length) {
            console.log(err);
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
    let lat = data[0].latitude;
    let lng = data[0].longitude;
    let location = data[0].formattedAddress;
    let newCampground = {name: name, image: image, description: desc, author: author, price: price, location: location, lng: lng, lat: lat};
    //Create a new campground and save to db
    Campground.create(newCampground, function(err, newNewCampground){
        if(err){
            console.log(err);
        } else {
            console.log(newCampground);
            //redirect back to campgrounds page
            res.redirect("/campgrounds");  
        }
    });
  });
});

//SHOW- shows additional detail about one campground
router.get("/campgrounds/:id", function(req, res){
    //Find the campground by the provided _id
    Campground.findById(req.params.id).populate("comments").exec(function(err, location){
       if(err || !location){
           req.flash("error", "Campground was not found");
           res.redirect("back");
       } else {
           //render show template with that campground
           res.render("campgrounds/show", {campground: location});
       }
    });
});

//Edit campground route
router.get("/campgrounds/:id/edit", middleware.checkOwnership, function(req, res){
    //is user logged in
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});   
        }
     });
});

//Update campground route
router.put("/campgrounds/:id", middleware.checkOwnership, function(req, res){
    geocoder.geocode(req.body.location, function(err, data){
        if(err || !data.length){
            console.log(data, "error============== on put", err);
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
    let lat = data[0].latitude;
    let lng = data[0].longitude;
    let location = data[0].formattedAddress;
    let newData = {name: req.body.name, image: req.body.image, description: req.body.description, location: location, lat: lat, lng: lng};
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, newData, function(err, campground){
        if(err){
            console.log("findbyidand update: ", err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            console.log("updated info: ", newData);
            console.log("old info: ", req.body);
            req.flash("success", "Successfully Updated!");      
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
  });
    //redirect to show page
});

//Destroy campground route
router.delete("/campgrounds/:id", middleware.checkOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;