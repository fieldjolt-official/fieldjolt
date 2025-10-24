import { execSync } from "node:child_process";
import fs from "node:fs";
import { checkDocker, ENV_FILES, sleep } from "./utils";

function checkENV() {
  const missing = ENV_FILES.filter((file) => !fs.existsSync(file.dest));

  if (missing.length > 0) {
    console.log("❌ Missing environment files:");

    for (const file of missing) {
      console.log(`   - ${file.dest}`);
    }

    console.log("\n💡 Run: pnpm setup");
    process.exit(1);
  }
}

async function waitForDatabase() {
  const maxAttempts = 30;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const result = execSync(
        "docker exec fieldjolt_db pg_isready -U fieldjolt_dev_user -d fieldjolt_dev",
        { encoding: "utf-8", stdio: "pipe" }
      );

      if (result.includes("accepting connections")) {
        return;
      }
    } catch (_error) {
      // Database not ready yet
    }

    attempts++;
    process.stdout.write(".");
    await sleep(1);
  }

  throw new Error("Database failed to become ready after 30 seconds");
}

async function checkDatabase() {
  try {
    const result = execSync(
      'docker ps --filter "name=fieldjolt_db" --format "{{.Status}}"',
      { encoding: "utf-8" }
    );

    if (!result.includes("Up")) {
      console.log("🔄 Starting database...");
      execSync("docker-compose up -d", { stdio: "inherit" });
      console.log("⏳ Waiting for database to be ready");
      await waitForDatabase();
    }
  } catch (_error) {
    console.log("🔄 Starting database...");
    execSync("docker-compose up -d", { stdio: "inherit" });
    console.log("⏳ Waiting for database to be ready");
    await waitForDatabase();
  }
}

async function main() {
  console.log("🔍 Checking development environment...");

  checkDocker();
  checkENV();
  await checkDatabase();

  console.log("✅ Environment ready!");
}

main().catch((error) => {
  console.error("❌ Setup check failed:", error);
  process.exit(1);
});
