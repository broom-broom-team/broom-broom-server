const { Router } = require("express");
const mainRouter = require("./main.router");
const authRouter = require("./auth.router");
const addressRouter = require("./address.router");
const userRouter = require("./user.router");
const postRouter = require("./post.router");
const rootRouter = Router();

function router() {
  mainRouter(rootRouter);
  authRouter(rootRouter);
  addressRouter(rootRouter);
  userRouter(rootRouter);
  postRouter(rootRouter);

  return rootRouter;
}

module.exports = router;
