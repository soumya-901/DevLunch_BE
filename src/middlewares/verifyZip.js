const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");
const { projectConfig } = require("../global/constants");
const { deleteFile } = require("../utils/security");

// Middleware to validate the uploaded zip file
const validateZip = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  console.log("res.local in validate zip ", res.locals);
  try {
    const { projectType } = req.body; // Get project type from request body
    const config = projectConfig[projectType];

    if (!config) {
      return res
        .status(400)
        .json({ error: "Invalid or unsupported project type" });
    }

    // Check file size
    const fileSizeMB = req.file.size / (1024 * 1024);
    if (fileSizeMB > config.sizeLimitMB) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: `File exceeds the size limit of ${config.sizeLimitMB} MB`,
      });
    }

    // Open the .zip file from the filesystem
    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();

    // console.log("file details from zip ", zipEntries);
    let requiredFilesFound = new Set(config.requiredFiles);

    console.log("requrired files set ", requiredFilesFound);
    // Validate the contents of the .zip file
    for (const entry of zipEntries) {
      const entryName = entry.entryName;

      // Check for forbidden folders
      for (const forbiddenFolder of config.forbiddenFolders) {
        if (entryName.startsWith(forbiddenFolder)) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({
            error: `Zip file contains forbidden folder: ${forbiddenFolder}`,
          });
        }
      }

      // Check for required files
      requiredFilesFound.delete(entryName);
    }

    // If any required files are missing, reject the zip
    if (requiredFilesFound.size > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: `Missing required files: ${[...requiredFilesFound].join(", ")}`,
      });
    }

    // Validation passed
    req.runCmd = config.runCmd; // Pass the run command to the next middleware
    res.locals["fileDetails"] = req?.file;
    next();
  } catch (error) {
    if (req.file.path) {
      deleteFile(req.file.path).then((res) => {
        console.log(
          `[Error] - file of path ${req.file.path} deleted successfully`
        );
      });
    }
    return res
      .status(500)
      .json({ error: "Failed to process zip file", details: error.message });
  }
};

module.exports = { validateZip };
