const router = require('express-promise-router')();
const passport = require('passport');
const ArticleController = require('../controllers/articles');
require('../passport');

const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/test')
  .get(passportJWT, ArticleController.test);

router.route('/create')
  .post(passportJWT, ArticleController.createArticle);


module.exports = router;