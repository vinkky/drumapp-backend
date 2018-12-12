const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

const signToken = (user) => {
  return JWT.sign({
    iss: 'CodeWorkr',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
};

mongoose.set('debug', true);


module.exports = {
  signUp: async (req, res) => {
    const { name, email, password } = req.value.body;

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ 'local.email': email });
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' });
    }

    // Create a new user
    const newUser = new User({
      method: 'local',
      email: email,
      name: name,
      password: password,
      local: {
        email: email,
        name: name,
        password: password
      }
    });

    await newUser.save();

    // Generate the token
    const token = signToken(newUser);
    // Respond with token
    return res.status(200).json({ token });
  },

  signIn: async (req, res) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  googleOAuth: async (req, res) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  facebookOAuth: async (req, res) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  getUser: async (req, res) => {
    return User.findById(req.params.id)
      .then((user) => {
        res.status(200).json({ user });
      });
  },
  forgotPass: async (req, res, next) => {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            res.status(400).json({ errorMsg: 'No account with that email address exists' });
            // return res.redirect('/forgot');
          } else {

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: 'emailSender123',
            pass: 'emailsender123'
          }
        });

        var mailOptions = {
          to: user.email,
          from: 'tautvydas.buda1@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + 'localhost:3000' + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        smtpTransport.sendMail(mailOptions, function (err) {
          res.status(200).json({ sucess: 'SUCCESS' });
          done(err, 'done');
        });
      }
    ], function (err) {
      if (err) return next(err);
      //res.redirect('/forgot');
    });
  },
  resetget: async (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
      if (!user) {
        res.status(400).json({ errorMsg: 'Password reset token invalid or has been expired' });
        return res.redirect('/forgot');
      }
      res.status(200).json({ success: 'success, redirect to reset' });
      // res.render('reset', {
      //   user: req.user
      // });
    });
  },
  resetpost: async (req, res) => {
    async.waterfall([
      function (done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
          if (!user) {
            res.status(400).json({ errorMsg: 'Password reset token invalid or has been expired' });
          } else {
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              res.status(200).json({ success: 'users password has been changed' });
              done(err, user);
            });
          }
        });
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: 'emailSender123',
            pass: 'emailsender123'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          res.status(200).json({ success: 'email has been changed' });
          done(err);
        });
      }
    ], function (err) {
      res.status(200).json({ success: 'redirect somewhere' });
    });
  },

  secret: async (req, res) => {
    res.json({ secret: 'resource' });
  }
};