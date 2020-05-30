var db = require("../models");

module.exports = function(app) {
     // Load index page
     app.get("/", function(req, res) {
          db.Article.find({articleSaved: false})
          .then(function (dbResults){
               if(dbResults.length > 0){
                    res.render("index", 
                    {
                         results: dbResults.map(result => result.toJSON()),
                         hide: false
                    });
               } else {
                    res.render("index", 
                    {
                         results: dbResults.map(result => result.toJSON()),
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
          db.Article.find({articleSaved: true})
          .then(function (dbResults){
               if(dbResults.length > 0){
                    res.render("savedarticles", 
                    {
                         results: dbResults.map(result => result.toJSON()),
                         hide: false
                    });
               } else {
                    res.render("savedarticles", 
                    {
                         results: dbResults.map(result => result.toJSON()),
                         hide: true
                    });
               }
          })
          .catch(function(err) {
               res.json(err);
          });
     });

     // Render 404 page for any unmatched routes
     app.get("*", function(req, res) {
          res.render("404");
     });
};