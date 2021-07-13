const passport = require("passport");
const local = require("./localStrategy");
const model = require("../../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    model.User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((e) => done(e));
  });

  local();
};
