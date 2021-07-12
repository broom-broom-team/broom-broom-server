const app = require("./app");
const logger = require("./helpers/winston");

// app
app.listen(app.get("port"), () => {
  logger.info("🚀🚀🚀 " + app.get("port") + "번 포트에서 서버를 시작합니다! 🚀🚀🚀");
});
