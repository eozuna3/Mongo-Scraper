var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");

module.exports = function(app) {
     app.get("/api/scrapearticles", function(req, res) {
          console.log("program has reached apiRoutes");
          axios.get("https://www.nytimes.com/").then(function(response) {
               var $ = cheerio.load(response.data);
               var scrapeResults = [];

               $("article.css-8atqhb").each(function(i, element) {
                    var articleTitle = $(element).find("h2").text();
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
               //console.log(scrapeResults);
               //console.log("-----------------------------------\n")

               for (let index = 0; index < scrapeResults.length; index++) {
                    db.Article.create(scrapeResults[index])
                    .then(function(dbArticle) {
                         console.log(dbArticle);
                    })
                    .catch(function(err) {
                         console.log(err + "\n---Error occured with add new articles to database");
                    });
               }
               res.end();
          });
     });

     // Empty articles collection
     app.delete("/api/cleararticles", function(req, res) {
          db.Article.collection.drop()
          .then (function (response){
               console.log("Articles Collection was cleared successfully");
               res.end();
          })
          .catch(function(err) {
               console.log(err + "\n---Error occured with add trying to clear Articles Collection");
          });
    });

    // Update savedArticle to true
    app.put("/api/updateSaved/:id", function(req, res) {
         console.log("\n------ You have reached saved article update api route----------------")
         console.log(req.params.id);
         console.log("\n");
          db.Article.findOneAndUpdate({_id : req.params.id}, { articleSaved: true})
          .then (function (response){
               console.log("articleSaved value  was successfully changed to true");
               res.end();
          })
          .catch(function(err) {
               console.log(err + "\n---Error occured with trying to change articleSaved value");
          });
    });

    // Update savedArticle to false
    app.put("/api/updateUnsaved/:id", function(req, res) {
         console.log("\n------ You have reached saved article update api route----------------")
         console.log(req.params.id);
         console.log("\n");
          db.Article.findOneAndUpdate({_id : req.params.id}, { articleSaved: false})
          .then (function (response){
               console.log("articleSaved value  was successfully changed to false");
               res.end();
          })
          .catch(function(err) {
               console.log(err + "\n---Error occured with trying to change articleSaved value");
          });
    });
};