module.exports = function(app) {
     // Load index page
     app.get("/", function(req, res) {
          res.render("index");
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