const auth = require("../middlewares/auth.middleware");
const upload = require("./upload.middleware");

module.exports = { auth, upload };
