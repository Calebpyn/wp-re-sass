const multer = require('multer');

// Configure storage
const storage = multer.memoryStorage(); // Store file in memory

// Set up multer with storage configuration
const upload = multer({ storage });

module.exports = upload;
