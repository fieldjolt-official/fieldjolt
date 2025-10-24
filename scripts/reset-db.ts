import { execSync } from "node:child_process";
import { sleep } from "./utils";

function checkDocker() {
  try {
    execSync("docker ps", { stdio: "ignore" });
  } catch (_error) {
    console.log("❌ Docker is not running. Please start Docker Desktop.");
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
        console.log("✅ Database is ready!");
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

async function resetDatabase() {
  console.log("🗑️  Stopping and removing database containers and volumes...");
  execSync("docker-compose down -v", { stdio: "inherit" });

  console.log("\n🔄 Starting fresh database...");
  execSync("docker-compose up -d", { stdio: "inherit" });

  console.log("\n⏳ Waiting for database to be ready");
  await waitForDatabase();

  console.log("\n📊 Pushing database schema...");
  execSync("pnpm --filter @fieldjolt/db db:push", { stdio: "inherit" });

  console.log("\n🌱 Seeding database...");
  execSync("pnpm seed-db", { stdio: "inherit" });
}

async function main() {
  console.log("🔄 Resetting database...\n");

  checkDocker();
  await resetDatabase();

  console.log("\n✅ Database reset complete!");
}

main().catch((error) => {
  console.error("❌ Database reset failed:", error);
  process.exit(1);
});
