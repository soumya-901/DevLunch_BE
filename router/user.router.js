const router = require("express").Router();
const {
  signIn,
  signUp,
  verifyotpcontoller,
} = require("../src/controlllers/auth");
const {
  getAllProjectsDetails,
  createNewProject,
} = require("../src/controlllers/projects");
const { verifyToken } = require("../src/middlewears/verifyToken");

router.get("/healthcheck", (req, res) => {
  res.json({ status: true, message: "Backend Up and Running" });
});

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/verifyotp", verifyToken, verifyotpcontoller);
router.get("/createNewProject", verifyToken, createNewProject);
router.get("/projectsDetails", verifyToken, getAllProjectsDetails);
module.exports = {
  router,
};
