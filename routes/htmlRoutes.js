var db = require("../models");

module.exports = function(app) {
     // Load index page
     app.get("/", function(req, res) {
          db.Article.find({articleSaved: false})
          .then(function (dbResults){
               console.log("\n-------------------------------\n");
               console.log(dbResults)
               console.log("\n-------------------------------\n");
               if(dbResults.length > 0){
                    res.render("index", 
                    {
                         results: dbResults,
                         hide: false
                    });
               } else {
                    res.render("index", 
                    {
                         results: dbResults,
                         hide: true
                    });
               }
          })
          .catch(function(err) {
               res.json(err);
          });
     });

     // Load Save Articles Page
     app.get("/savedarticles", function(req, res) {
          res.render("savedarticles");
     });

     // Render 404 page for any unmatched routes
     app.get("*", function(req, res) {
          res.render("404");
     });
};