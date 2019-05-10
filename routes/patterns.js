const router = require('express-promise-router')();
const passport = require('passport');
const ArticleController = require('../controllers/pattern');
require('../passport');

const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/create').post(passportJWT, ArticleController.createPattern);

router.route('/rename').post(passportJWT, ArticleController.renamePattern);

router.route('/update').post(passportJWT, ArticleController.updatePattern);

router.route('/getAll').get(passportJWT, ArticleController.getPattern);

router.route('/getOne').get(passportJWT, ArticleController.getPatterns);

router.route('/delete').post(passportJWT, ArticleController.deletePattern);

module.exports = router;
