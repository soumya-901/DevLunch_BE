const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTTLIndex() {
  try {
    // const result = await prisma.$runCommandRaw({
    //   createIndexes: "Otp", // Collection name
    //   indexes: [
    //     {
    //       key: { createdAt: 1 }, // Index on `createdAt`
    //       name: "otp_createdAt_ttl_index", // Index name
    //       expireAfterSeconds: 300, // TTL of 5 minutes
    //     },
    //   ],
    // });

    console.log("TTL Index Created:", result);
    return "created successfully";
  } catch (error) {
    console.error("Error creating TTL index:", error);
  }
}

module.exports = {
  prisma,
  createTTLIndex,
};
