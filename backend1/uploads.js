const multer = require("multer");
const path = require("path");

// Set up the storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");  // Path where the files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, "data.csv");  // The name of the uploaded file
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

module.exports = upload;
