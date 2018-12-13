const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = 'mongodb://localhost:27017/musicapp';

// Connect to MongoDB
mongoose
  .connect(db,  {useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Cors middleware
app.use(cors());
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Passport Config
// require('./config/passport')(passport);

// Routes
app.use('/users', require('./routes/users'))
app.use('/articles', require('./routes/articles'))
app.use('/tracks', require('./routes/tracks'))

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5070;
app.listen(port, () => console.log(`Server running on port ${port}`))