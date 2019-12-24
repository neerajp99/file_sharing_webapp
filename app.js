const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const keys = require("./config/keys");
// import multer for storage
const multer = require("multer");
// import routes
const appRoute = require('./routes/api/appRoute')

// Initialise express app
const app = express();

// Add body-parser middleware to get body details
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//Multer storage directory
const storageDirectory = path.join(__dirname, "..", "storage");

// Multer - File Storage configuration
// The disk storage engine gives you full control on storing files to disk.
// For info https://github.com/expressjs/multer#diskstorage

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, storageDirectory);
  },
  filename: (req, file, cb) => {
    // returns the extension of a file path.
    // for more info: https://github.com/expressjs/multer#api
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
// add the destination to multer
const upload = multer({ 'storageDirectory': storageDirectory });

// storing names to the values
app.set("storageSirectory", storageDirectory);
app.set("upload", upload);

// Use routing
app.use('/api/appRoute', appRoute)

// Add database connection
const db = keys.mongoURI;
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(res => {
    console.log("Database connected successfully!");
  })
  .catch(error => {
    console.log(error);
  });

// Add port
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

module.exports = app;