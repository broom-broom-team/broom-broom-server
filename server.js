const app = require("./app");
const logger = require("./helpers/winston");

// app
const server = app.listen(app.get("port"), () => {
  logger.info("πππ " + app.get("port") + "λ² ν¬νΈμμ μλ²λ₯Ό μμν©λλ€! πππ");
});

const io = require("socket.io")(server);

io.use((socket, next) => {
  app.sessionMiddleWare(socket.request, socket.request.res, next);
});

const connection = require("./helpers/socket");
connection(io);
