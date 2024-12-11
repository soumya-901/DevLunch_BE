const router = require("express").Router();
const {
  signIn,
  signUp,
  verifyotpcontoller,
} = require("../src/controlllers/auth");
const {
  getAllProjectsDetails,
  createNewProject,
  downloadProject,
} = require("../src/controlllers/projects");
const { verifyToken } = require("../src/middlewares/verifyToken");
const { validateZip } = require("../src/middlewares/verifyZip");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Multer configuration for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR); // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});
const upload = multer({ storage });

router.get("/healthcheck", (req, res) => {
  res.json({ status: true, message: "Backend Up and Running" });
});

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/verifyotp", verifyToken, verifyotpcontoller);
router.post(
  "/createNewProject",
  upload.single("file"),
  verifyToken,
  validateZip,
  createNewProject
);
router.get("/projectsDetails", verifyToken, getAllProjectsDetails);
router.post("/downloadCodeFile", downloadProject);
module.exports = {
  router,
};
