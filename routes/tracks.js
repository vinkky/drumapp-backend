const router = require('express-promise-router')();
const passport = require('passport');
const TrackController = require('../controllers/tracks');
require('../passport');

const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/:trackID')
  .get(TrackController.getTrack);

router.route('/')
  .post(TrackController.postTrack);


module.exports = router;