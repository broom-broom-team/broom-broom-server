const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("./helpers/winston");
const passport = require("passport");
const helmet = require("helmet");

dotenv.config();

const { sequelize } = require("./models");
const router = require("./routes");
const passportConfig = require("./helpers/passport");

// app set
const app = express();
app.set("port", process.env.PORT || 3001);
passportConfig();

// sequelize sync
sequelize
  .sync({ force: false })
  .then(() => {
    logger.info("정상적으로 데이터베이스에 연결되었습니다.");
  })
  .catch((err) => {
    logger.error(err);
  });

// session option set
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: { httpOnly: true, secure: false },
  store: new SequelizeStore({ db: sequelize }),
};
if (process.env.NODE_ENV === "production") {
  // for https
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}

const sessionMiddleWare = session(sessionOption);

// middleware setting
if (process.env.NODE_ENV !== "development") {
  app.use(morgan("combined", { stream: logger.stream }));
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}
app.use("/images", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleWare);
app.use(passport.initialize());
app.use(passport.session());

// router
app.use("/", router());
app.use("/favicon.ico", (req, res) => {
  res.status(204);
});

// 404
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// error handling
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

module.exports = app;
