const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = require("../config/s3.config");

const storage = multerS3({
  s3: s3,
  bucket: "broombroom",
  key: (req, file, done) => {
    const extension = file.mimetype.split("/")[1];
    done(null, "broomProfile-" + Date.now() + "." + extension);
  },
});

const fileFilter = (req, file, done) => {
  const extension = file.mimetype.split("/")[1];
  if (extension == "jpg" || extension == "jpeg" || extension == "png") {
    done(null, true);
  } else {
    done({ message: "확장자명이 *.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다." }, false);
  }
};

exports.profileUpload = multer({ storage, fileFilter });
