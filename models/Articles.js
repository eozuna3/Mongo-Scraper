var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  articleTitle: {
    type: String,
    required: true
  },
  articleText: {
     type: String,
     required:true
  },
  articleLink: {
    type: String,
    required: true
  },
  articleSaved: {
     type:Boolean,
     default: false
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Notes"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Articles = mongoose.model("Articles", ArticleSchema);

// Export the Article model
module.exports = Articles;