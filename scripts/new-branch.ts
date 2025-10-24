import { execSync } from "node:child_process";
import { prompt } from "./utils";

async function createBranch() {
  console.log("🌟 Create New Branch\n");

  const branchName = await prompt(
    "Branch name (e.g., feature/job-scheduling): "
  );

  if (!branchName) {
    console.log("❌ Branch name required");
    process.exit(1);
  }

  const currentBranch = execSync("git branch --show-current", {
    encoding: "utf-8",
  }).trim();
  if (currentBranch !== "staging") {
    console.log("⚠️  You should create feature branches from staging");
    const proceed = await prompt("Continue anyway? (y/N): ");
    if (proceed.toLowerCase() !== "y") {
      console.log("💡 Run: git checkout staging");
      process.exit(1);
    }
  }

  console.log(`\n1️⃣  Creating git branch: ${branchName}...`);
  try {
    execSync(`git checkout -b ${branchName}`, { stdio: "inherit" });
  } catch {
    console.log("❌ Failed to create branch");
    process.exit(1);
  }

  const resetDb = await prompt("\n2️⃣  Reset local database? (y/N): ");
  if (resetDb.toLowerCase() === "y") {
    console.log("🔄 Resetting database...");
    execSync("pnpm reset-db", { stdio: "inherit" });
  }

  console.log("\n✅ Feature branch created!\n");
  console.log("📋 Next steps:");
  console.log("   1. Make your changes");
  console.log(`   2. Commit: git add . && git commit -m "feat: ${branchName}"`);
  console.log(`   3. Push: git push -u origin ${branchName}`);
  console.log("   4. CI will automatically:");
  console.log("      - Create PlanetScale branch");
  console.log("      - Deploy preview to Vercel & Cloudflare");
  console.log("      - Post preview URLs in PR\n");
}

createBranch().catch(console.error);
