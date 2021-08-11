const connection = (io) => {
  io.on("connection", (socket) => {
    console.log("소켓연결");
  });
};

module.exports = connection;
