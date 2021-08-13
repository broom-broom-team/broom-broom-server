const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = require("../config/s3.config");

const profilestorage = multerS3({
  s3: s3,
  bucket: "broombroom",
  key: (req, file, done) => {
    const extension = file.mimetype.split("/")[1];
    done(null, "broomProfile-" + Date.now() + "." + extension);
  },
});

const imageMessageStorage = multerS3({
  s3: s3,
  bucket: "broombroom",
  key: (req, file, done) => {
    const extension = file.mimetype.split("/")[1];
    done(null, "broomMessage-" + Date.now() + "." + extension);
  },
});

const postStorage = multerS3({
  s3: s3,
  bucket: "broombroom",
  key: (req, file, done) => {
    const extension = file.mimetype.split("/")[1];
    const randomNumber = Math.floor(Math.random() * 999);
    done(null, "broomPost-" + Date.now() + "-" + randomNumber + "." + extension);
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

exports.profileUpload = multer({ storage: profilestorage, fileFilter });
exports.postUpload = multer({ storage: postStorage, fileFilter });
exports.messageUpload = multer({ storage: imageMessageStorage, fileFilter });
