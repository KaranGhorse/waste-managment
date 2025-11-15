const multer = require("multer");

// Store files in memory instead of disk
const storage = multer.memoryStorage();

// Allow single or multiple uploads
const upload = multer({ storage });

const singleUpload = upload.single("file");
const multipleUpload = upload.array("files", 3);

module.exports = {
  singleUpload,
  multipleUpload,
  upload
};
