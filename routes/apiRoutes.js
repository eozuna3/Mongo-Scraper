var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");

module.exports = function(app) {
     //  Scrape articles from the NYT
     app.get("/api/scrapearticles", function(req, res) {
          console.log("program has reached apiRoutes");
          db.Article.count()
          .then(function (articleCount){
               if(articleCount === 0){
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
               } else {
                    res.end();
               }
          });
     });

     // Empty articles collection
     app.delete("/api/cleararticles", function(req, res) {
          db.Article.count()
          .then(function (response){
               if(response > 0){
                    db.Article.remove()
                    .then (function (response){
                         console.log("Articles Collection was cleared successfully");
                         res.send(response);
                    })
                    .catch(function(err) {
                         console.log(err + "\n---Error occured with add trying to clear Articles Collection");
                    });
               } else {
                    res.end();
               }
          });
    });
    
    //Empty Notes Collection
    app.delete("/api/clearnotes", function(req, res) {
          db.Note.count()
          .then(function (response){
               if(response > 0){
                    db.Note.remove()
                    .then (function (response){
                         console.log("Notes Collection was cleared successfully");
                         res.send(response);
                    })
                    .catch(function(err) {
                         console.log(err + "\n---Error occured with add trying to clear Notes Collection");
                    });
               } else {
                    res.end();
               }
          })
    });

    // Update savedArticle to true
    app.put("/api/updateSaved/:id", function(req, res) {
         /*console.log("\n------ You have reached saved article update api route----------------")
         console.log(req.params.id);
         console.log("\n");*/
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
         /*console.log("\n------ You have reached saved article update api route----------------")
         console.log(req.params.id);
         console.log("\n");*/
          db.Article.findOneAndUpdate({_id : req.params.id}, { articleSaved: false})
          .then (function (response){
               console.log("articleSaved value  was successfully changed to false");
               res.end();
          })
          .catch(function(err) {
               console.log(err + "\n---Error occured with trying to change articleSaved value");
          });
    });

    //  Query the notes database to return all available notes to display in the notes modal
    app.get("/api/notes/:id", function(req, res) {
         /*console.log("\n------ You have reached get notes for passed article id api route----------------")
         console.log(req.params.id);
         console.log("\n");*/
          db.Article.find({_id : req.params.id})
          .populate("notes")
          .then (function (dbResults){
               //console.log(response);
               console.log("All notes related to articles have been successfully retrieved from the database");
               console.log(dbResults);
               res.json(dbResults);
          })
          .catch(function(err) {
               console.log(err + "\n---Error occured with trying to notes for selected article");
          });
    });

    //  Creation of a new note in the notes collection and linking it to the appropriate article
    app.post("/api/savenote/:id", function(req, res) {
          /*console.log("\n------ You have reached save note api route----------------")
          console.log(req.params.id);
          console.log(req.body);
          console.log("\n");*/
          db.Note.create(req.body)
          .then (function (dbNote){
               console.log("New note was successfully saved to note collection.");
               return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
          })
          .then(function(dbArticle) {
               res.json(dbArticle);
          })
          .catch(function(err) {
               console.log(err + "\n---Error occured with trying to add a new note to notes collection.");
          });
    });

    //  Query to remove the selected note from the notes collection and its reference in the   article collection
    app.delete("/api/deletenote/:id", function(req, res) {
          /*console.log("\n------ You have reached delete note api route----------------")
          console.log(req.body);
          console.log("\n");*/
          db.Note.remove({_id : req.body.noteID})
          .then (function (response){
               console.log("Note was successfully deleted from the notes collection.");
               db.Article.update( { _id: req.body.articleID }, { $pull: { notes: req.body.noteID } }, { new: true } )
               .then(function(response){
                    console.log("Note connection to article has been removed.");
               })
               .catch(function(err) {
                    console.log(err + "\n---Error occured with trying to remove note connection from article entry");
               });
               res.end();
          })
          .catch(function(err) {
               console.log(err + "\n---Error occured with trying to delete a note from the notes collection.");
          });
    });
};