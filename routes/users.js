// const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour"
});
// const router1 = express.Router();
require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');

const UsersController = require('../controllers/users');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
  .post(validateBody(schemas.loginSchema), passportSignIn, UsersController.signIn);

router.route('/oauth/google')
  .post(passport.authenticate('googleToken', { session: false }), UsersController.googleOAuth);

router.route('/oauth/facebook')
  .post(passport.authenticate('facebookToken', { session: false }), UsersController.facebookOAuth);

router.route('/get/:id')
  .get(UsersController.getUser);

router.route('/forgot')
  .post(createAccountLimiter, UsersController.forgotPass);

router.route('/reset/:token')
  .get(UsersController.resetget);

router.route('/reset/:token')
  .post(UsersController.resetpost);

router.route('/secret')
  .get(passportJWT, UsersController.secret);


module.exports = router;