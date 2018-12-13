const router = require('express-promise-router')();
const passport = require('passport');
const TrackController = require('../controllers/tracks');
require('../passport');

const passportJWT = passport.authenticate('jwt', { session: false });

// router.route('/:trackID')
//   .get(TrackController.getTrack);

// router.route('/')
//   .post(TrackController.postTrack);


router.route('/upload')
  .post(TrackController.uploadTrack);

router.route('/uploads')
  .post(TrackController.uploadTracks);

router.route('/:filename')
  .get(TrackController.getTrackURL);

router.route('/files/:filename')
  .get(TrackController.getTrackObject);

router.route('/')
  .get(TrackController.getAllTracks);

router.route('/:id')
  .delete(TrackController.deleteTrack);


module.exports = router;