const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

let comment

let data = 
    [
        {
            name: "Cloud's Rest",
            image: "https://farm3.staticflickr.com/2433/3866555243_1932e65d9c.jpg",
            description: "Sausage salami meatball biltong pastrami turkey shankle leberkas pork loin landjaeger. Chicken buffalo beef ribs, shankle drumstick fatback pig brisket sirloin. Kevin pork loin shank hamburger salami bacon. T-bone landjaeger short loin kevin burgdoggen."
        },
        {
            name: "Tanner's Peak",
            image: "https://farm3.staticflickr.com/2582/3820664827_6c2e9a69ae.jpg",
            description: "Sausage salami meatball biltong pastrami turkey shankle leberkas pork loin landjaeger. Chicken buffalo beef ribs, shankle drumstick fatback pig brisket sirloin. Kevin pork loin shank hamburger salami bacon. T-bone landjaeger short loin kevin burgdoggen."
        },
        {
            name: "Grover Point",
            image: "https://farm3.staticflickr.com/2433/3866555243_1932e65d9c.jpg",
            description: "Sausage salami meatball biltong pastrami turkey shankle leberkas pork loin landjaeger. Chicken buffalo beef ribs, shankle drumstick fatback pig brisket sirloin. Kevin pork loin shank hamburger salami bacon. T-bone landjaeger short loin kevin burgdoggen."
        },
        {
            name: "Granite Hill",
            image: "https://farm3.staticflickr.com/2582/3820664827_6c2e9a69ae.jpg",
            description: "Sausage salami meatball biltong pastrami turkey shankle leberkas pork loin landjaeger. Chicken buffalo beef ribs, shankle drumstick fatback pig brisket sirloin. Kevin pork loin shank hamburger salami bacon. T-bone landjaeger short loin kevin burgdoggen."
        }
    ];
    
function seedDB(){
    
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log('removed campgrounds');
        }
            //add a few campgrounds
             data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great but I wish there was internet.",
                                author: "Grovie"
                        }, function(err,comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log('created new comment');
                            }
                        });
                    }
                });
            });
     });
}

module.exports = seedDB;