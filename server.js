const express = require("express");
const { createTTLIndex } = require("./prisma");
const { handleErrors } = require("./src/middlewares/errorMiddleware");
const app = express();
app.use(express.json());

(function main() {
  console.log("Configuring Global Environments..");
  Object.entries(process.env).forEach(([key, value]) => {
    if (key.startsWith("USER_")) {
      global[key.split("USER_")[1]] = value;
    }
  });

  const { router } = require("./router/user.router");
  console.log("Running for Environment ", global.ENVIRONMENT);
  if (!(global.ENVIRONMENT == "dev")) {
    createTTLIndex();
  }
  app.use("/api", router);
  app.use(handleErrors);
})();

app.listen(global.PORT, () => {
  console.log(
    `------------------Code Flyer Up and Running on ${PORT}  ------------------------`
  );
});
