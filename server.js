const app = require("./app");
const logger = require("./helpers/winston");

// app
const server = app.listen(app.get("port"), () => {
  logger.info("🚀🚀🚀 " + app.get("port") + "번 포트에서 서버를 시작합니다! 🚀🚀🚀");
});

const io = require("socket.io")(server);

io.use((socket, next) => {
  app.sessionMiddleWare(socket.requset, socket.requset.res, next);
});

const connection = require("./helpers/socket");
connection(io);
