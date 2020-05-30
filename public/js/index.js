$(document).ready(function() {
     // OnClick Event handlers 
     $(document).on("click", ".scrapeNewArticles", handleScrapeNewArticlesClick);
     $(document).on("click", ".clearArticlesBtn", handleClearArticlesBtnClick);
     $(document).on("click", ".saveArticleBtn", function () { handleSaveArticleBtnClick($(this).data("id"))});
     $(document).on("click", ".unsaveArticleBtn", function () { handleUnsaveArticleBtnClick($(this).data("id"))});
     $(document).on("click", ".articleNoteBtn", function () { handleArticleNoteBtnClick($(this).data("id"))});
     $(document).on("click", "#closeNotesBtn", handleCloseNotesBtnClick);
     $(document).on("click", "#saveNoteBtn", function () { handleSaveNoteBtnClick($(this).data("id"))});

     // Scrape NYT for articles
     function handleScrapeNewArticlesClick() {
          console.log("a scrapedarticle button was pressed");
          $.get("/api/scrapearticles")
          .then(function(data) {
          //console.log("\n----------------------------\n");
          //console.log(data);
          window.location.reload("/");
          window.location.reload("/");
          })
          .catch(function (err) {
               console.log("Error occurred and was unable to scrape Articles collection.\n");
               console.log(err);
          });
     }
    
     //  Handler for clearing all scraped articles and notes from the articles collection     
     function handleClearArticlesBtnClick(){
          $.ajax({ 
               url: "/api/cleararticles",
               method: "DELETE" 
          })
          .then(function (data) {
                console.log("Articles collection was cleared.");
          })
          .catch(function (err) {
               console.log("Error occurred and was unable to clear Articles collection.\n");
               console.log(err);
          });

          $.ajax({ 
               url: "/api/clearnotes",
               method: "DELETE" 
          })
          .then(function (data) {
                console.log("Notes collection was cleared.");
          })
          .catch(function (err) {
               console.log("Error occurred and was unable to clear Notes collection.\n");
               console.log(err);
          });
          window.location.reload();
     }

     
     // Onclick handler for the when the saveArticle button is pressed
     function handleSaveArticleBtnClick (articleId){
       console.log(articleId + " save article button was pushed");
       $.ajax({ 
               url: "/api/updateSaved/" + articleId,
               method: "PUT" 
          })
          .then(function (data) {
                console.log("Article was saved.");
                window.location.reload("/");
          })
          .catch(function (err) {
               console.log("Error occurred and was unable to save article.\n");
               console.log(err);
          });
     }

     // Onclick handler for the when the unsaveArticle button is pressed
     function handleUnsaveArticleBtnClick (articleId){
      console.log(articleId + " save article button was pushed");
       $.ajax({ 
               url: "/api/updateUnsaved/" + articleId,
               method: "PUT" 
          })
          .then(function (data) {
                console.log("Article was unsaved.");
                window.location.reload("/");
          })
          .catch(function (err) {
               console.log("Error occurred and was unable to save article.\n");
               console.log(err);
          });
     }

     function handleArticleNoteBtnClick (articleId){
          console.log("\n" + articleId + " article note button was pushed\n");
          $("#notesModal").modal({
               show: true,
               backdrop: "static",
               keyboard: false
          });
          $.get("/api/notes/" + articleId)
          .then(function(results) {
               console.log(results);
               $("#notesModalTitle").text("Notes For Article : " + articleId);
               if (results.length > 0) {
                   let availableNotes = [];
                    for(let i = 0; i < results.length; i++){
                         let noteBody = $("<li class='list-group-item'>").text(results).append($("<button class='btn btn-danger deleteNoteBtn' data-id='" + results._id + "'>x</button>"));
                         availableNotes.push(noteBody);
                    }
                    $("#notesList").append(availableNotes);
                    console.log("notes available");
                    $("#saveNoteBtn").data("id", articleId);
               } else {
                    $("#notesList").append("<li class='list-group-item'>No notes for this article yet.</li>");
                    $("#saveNoteBtn").data("id", articleId);
               }              
          })
          .catch(function (err) {
               console.log("Error occurred and was unable to load the notes modal.\n");
               console.log(err);
          });
     }

     function handleSaveNoteBtnClick (articleId){
          console.log("\n-----Save note button was pushed\n");
          console.log(articleId);

          $.ajax({
            method: "POST",
            url: "/api/savenote/" + articleId,
            data: { noteText: $("#noteBody").val()}
          })
          .then(function(data) {
            console.log(data);
          });
          
          $("#notesList").empty();
          $("#noteBody").val("");
          $("#notesModal").modal("hide");
     }

     function handleCloseNotesBtnClick () {
       console.log("\n----Close note button was pushed---\n");
       $("#notesList").empty();
       $("#noteBody").val("");
       $("#notesModal").modal("hide");
     }
});