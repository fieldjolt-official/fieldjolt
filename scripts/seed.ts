import prisma from "../packages/db/src";

async function main() {
  console.log("Seeding database...");
  await prisma.$transaction([])
}

main().catch((error) => {
  console.error("❌ Setup check failed:", error);
  process.exit(1);
});
