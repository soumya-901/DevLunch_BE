const { prisma } = require("../../prisma");
const { uploadZipFile } = require("../lib/cloudnary.lib");
const fs = require("fs");
const { deleteFile } = require("../utils/security");

async function createNewProject(req, res, next) {
  //Get user details from the verification
  let userDetails = res.locals.userDetails;
  console.log("Requested user details ", res.locals.userDetails);

  const { projectName, envType, size } = req.body;
  const fileDetails = res.locals.fileDetails;
  console.log("file details", fileDetails);
  try {
    // const uploadFileDetails = await uploadZipFile(res.locals.fileDetails.path);
    const project = await prisma.project.create({
      data: {
        projectName: projectName,
        envType: envType,
        size: size,
        user: {
          connect: { id: userDetails?.id },
        },
        CodeUrl: fileDetails?.path,
      },
    });
    console.log("Project created successfully:", project);
    return res.json({
      status: true,
      message: "Project Details Fetched Successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    next(error);
    throw error;
  }
}

async function getAllProjectsDetails(req, res) {
  let userDetails = res.locals.userDetails;
  try {
    // Fetch the user along with their projects
    const userWithProjects = await prisma.user.findUnique({
      where: { id: userDetails?.id },
      include: {
        projects: true, // Include the related projects
      },
    });

    if (!userWithProjects) {
      console.log("User not found");
      return { message: "User not found" };
    }

    console.log("User's Projects:", userWithProjects.projects);
    return res.json({
      status: true,
      message: "All project fetched successfully",
      data: userWithProjects.projects,
    });
  } catch (error) {
    console.error("Error fetching user's projects:", error);
    throw error;
  }
}

async function downloadProject(req, res, next) {
  const { projectId } = req.body; // Get the project id from the body
  // const {}
  if (!projectId) {
    return next({
      status: 400,
      message: "projectId is required in query parameters",
    });
  }
  try {
    const projectDetails = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    console.log("Project Detals ", projectDetails);

    // Path to the uploads folder

    const filePath = projectDetails.CodeUrl;

    const fileStream = fs.createReadStream(filePath); // Stream the file

    fileStream.on("error", (err) => {
      console.error("Error reading file:", err.message);
      res.status(500).json({ error: "Error while reading the file" });
    });

    // Pipe the file stream directly to the response
    fileStream.pipe(res);

    // After the response finishes, you can delete the file
    res.on("finish", async () => {
      console.log("file download successfully in ", filePath);
      const data = await deleteFile(filePath);
      console.log(data);
    });
  } catch (error) {
    console.log("erro on file download");
  }
}

module.exports = {
  createNewProject,
  getAllProjectsDetails,
  downloadProject,
};
