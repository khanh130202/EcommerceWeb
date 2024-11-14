const multer = require("multer");
const path = require("path");
const ApiError = require("../api-error");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/ckeditorImages/");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

function upload(req, res, next) {
  const upload = multer({ storage: storage }).single("upload");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(
        new ApiError(400, "An error occurred while uploading the avatar")
      );
    } else if (err) {
      return next(
        new ApiError(
          500,
          "An unknown error occurred while uploading the avatar"
        )
      );
    }
    if (!req.file) {
      // Không có tệp tin nào được truyền, bỏ qua phần tải ảnh đại diện
      return next();
    }
    next();
  });
}

module.exports = upload;
