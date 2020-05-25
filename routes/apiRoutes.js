var cheerio = require("cheerio");
var axios = require("axios");


module.exports = function(app) {
     app.get("/api/scrapearticles", function(req, res) {
          console.log("program has reached apiRoutes");
          axios.get("https://www.nytimes.com/").then(function(response) {
               var $ = cheerio.load(response.data);
               var scrapeResults = [];
               
               $("article.css-8atqhb").each(function(i, element) {
                    var articleTitle = $(element).find("h2.esl82me0").text();
                    var articleText = $(element).find("p").text();
                    var articleListText = $(element).find("li").text();
                    var articleLink =  "https://www.nytimes.com" + $(element).find("a").attr("href");
                    if (articleText === ""){
                         if (articleListText !== "") {
                              scrapeResults.push({
                                   articleTitle: articleTitle,
                                   articleText: articleListText,
                                   articleLink: articleLink
                              });
                         }
                    } else {                    
                         scrapeResults.push({
                              articleTitle: articleTitle,
                              articleText: articleText,
                              articleLink: articleLink
                         });
                    }
               });
               console.log(scrapeResults);
               res.json(scrapeResults)
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