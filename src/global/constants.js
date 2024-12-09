// In-memory storage for user details (e.g., Redis, but here we'll use a simple object for demo purposes)
const userCache = new Map();

const projectConfig = {
  nodejs: {
    requiredFiles: ["package.json", "package-lock.json"],
    forbiddenFolders: ["node_modules", ".git"],
    sizeLimitMB: 50, // Maximum size in MB
    runCmd: "node server.js", // Example run command
  },
  react: {
    requiredFiles: ["package.json", "src/App.js"],
    forbiddenFolders: ["node_modules", ".git"],
    sizeLimitMB: 50, // Maximum size in MB
    runCmd: "npm start", // Example run command
  },
  // Add more environments as needed
};

module.exports = { projectConfig, userCache };
