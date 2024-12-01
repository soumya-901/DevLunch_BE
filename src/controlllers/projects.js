const { prisma } = require("../../prisma");

async function createNewProject(req, res, next) {
  //Get user details from the verification
  let userDetails = res.locals.userDetails;
  console.log("Requested user details ", userDetails);

  const { projectName, envType, size } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        projectName: projectName,
        envType: envType,
        size: size,
        user: {
          connect: { id: userDetails?.id },
        },
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

module.exports = {
  createNewProject,
  getAllProjectsDetails,
};
