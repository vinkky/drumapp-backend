const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create a schema
const article = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
});

// Create a model
const Article = mongoose.model('article', article);

// Export the model
module.exports = Article;