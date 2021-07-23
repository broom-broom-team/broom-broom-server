const { Router } = require("express");
const authRouter = require("./auth.router");
const addressRouter = require("./address.router");
const userRouter = require("./user.router");
const rootRouter = Router();

function router() {
  authRouter(rootRouter);
  addressRouter(rootRouter);
  userRouter(rootRouter);

  return rootRouter;
}

module.exports = router;
