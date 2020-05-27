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
  note: {
    type: Schema.Types.ObjectId,
    ref: "Notes"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Articles = mongoose.model("Articles", ArticleSchema);

// Export the Article model
module.exports = Articles;