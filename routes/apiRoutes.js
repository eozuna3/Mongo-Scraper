var cheerio = require("cheerio");
var axios = require("axios");


module.exports = function(app) {
     app.get("/api/scrapedarticles", function(req, res) {
          axios.get("https://www.nytimes.com/").then(function(response) {
               console.log(response.data);
               return response.data;
          });
     });

  /* Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });*/
};