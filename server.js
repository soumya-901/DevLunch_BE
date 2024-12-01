const express = require("express");
const { router } = require("./router/user.router");
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

(function main() {
  console.log("Configuring Global Environments..");
  global.JWT_SECRET = process.env.JWT_SECRET;
  global.COOKIE_NAME = process.env.COOKIE_NAME;
  console.log("global variables ", global.global.JWT_SECRET);
  app.use("/api", router);
})();

app.listen(PORT, () => {
  console.log(
    `------------------Code Flyer Up and Running on ${PORT}  ------------------------`
  );
});
