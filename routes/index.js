const { Router } = require("express");
const authRouter = require("./auth.router");
const rootRouter = Router();

function router() {
  authRouter(rootRouter);

  return rootRouter;
}

module.exports = router;
