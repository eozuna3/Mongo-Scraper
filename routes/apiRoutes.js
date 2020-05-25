var cheerio = require("cheerio");
var axios = require("axios");


module.exports = function(app) {
     app.get("/api/scrapearticles", function(req, res) {
          console.log("program has reached apiRoutes");
          axios.get("https://www.nytimes.com/").then(function(response) {
               var $ = cheerio.load(response.data);
               var results = [];

               $("article.css-8atqhb").each(function(i, element) {
                    var articleTitle = $(element).find("h2.esl82me0").text();
                    var articleText = $(element).find("p").text();
                    var articleListText = $(element).find("li").text();
                    if (articleText === ""){
                         if (articleListText !== "") {
                              results.push({
                                   articleTitle: articleTitle,
                                   articleText: articleListText
                              });
                         }
                    } else {                    
                         results.push({
                              articleTitle: articleTitle,
                              articleText: articleText
                         });
                    }
               });
               console.log(results);
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