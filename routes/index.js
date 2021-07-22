const { Router } = require("express");
const authRouter = require("./auth.router");
const addressRouter = require("./address.router");
const rootRouter = Router();

function router() {
  authRouter(rootRouter);
  addressRouter(rootRouter);

  return rootRouter;
}

module.exports = router;
