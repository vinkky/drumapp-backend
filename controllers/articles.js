const mongoose = require('mongoose');
const User = require('../models/user');
const Article = require('../models/article');
const validateEventInput = require('../validation/article');

mongoose.set('debug', true);

module.exports = {
  test: async (req, res) => {
    res.json({ msg: 'Article Work' });
  },

  createArticle: async (req, res) => {
    const { errors, isValid } = validateEventInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    } else {
      User.findById(req.user.id).then((user) => {
        const newArticle = new Article({
          creator: user,
          title: req.body.title,
          text: req.body.text,
          category: req.body.category,
        });
        newArticle.save().then((article) => {
          res.json(article);
        });
      });
    }
  },


};
