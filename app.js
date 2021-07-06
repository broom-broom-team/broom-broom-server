const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

// app set
const app = express();
app.set("port", process.env.PORT || 3001);

// middleware setting
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 404
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 서버를 시작합니다!");
});
