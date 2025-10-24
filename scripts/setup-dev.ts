import { execSync } from "node:child_process";
import { checkDocker, copyFile, ENV_FILES, prompt, sleep } from "./utils";

async function setupEnvironmentFiles() {
  console.log("2️⃣  Setting up environment files...");

  let needsConfig = false;
  for (const { source, dest } of ENV_FILES) {
    if (copyFile(source, dest)) {
      needsConfig = true;
    }
  }

  if (needsConfig) {
    console.log("\n📝 Please update the environment files with your values:");
    for (const { dest } of ENV_FILES) {
      console.log(`   - ${dest}`);
    }
    await prompt("\nPress ENTER when ready to continue...");
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
        console.log("   ✅ Database is ready!");
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

async function startDatabase() {
  console.log("\n3️⃣  Starting PostgreSQL database...");
  execSync("docker-compose up -d", { stdio: "inherit" });
  console.log("   ⏳ Waiting for database to be ready");
  await waitForDatabase();
}

function setupDatabaseSchema() {
  console.log("\n4️⃣  Setting up database schema...");
  execSync("pnpm --filter @fieldjolt/db db:push", { stdio: "inherit" });
  console.log("   ✅ Schema created");
}

async function seedDatabase() {
  console.log("\n5️⃣  Seeding database...");
  const shouldSeed = await prompt("Seed database with test data? (Y/n): ");
  if (shouldSeed.toLowerCase() !== "n") {
    execSync("pnpm seed-db", { stdio: "inherit" });
    console.log("   ✅ Database seeded");
  }
}

async function main() {
  console.log("🚀 FieldJolt Development Setup\n");
  console.log("This will set up your local development environment.\n");

  console.log("1️⃣  Checking Docker...");
  checkDocker();

  await setupEnvironmentFiles();
  await startDatabase();
  await setupDatabaseSchema();
  await seedDatabase();

  console.log("\n✨ Setup complete!\n");
  console.log("🎯 Next steps:");
  console.log("   1. Run: pnpm dev");
  console.log("   2. Open: http://localhost:3000\n");
  console.log("📚 Documentation: docs/development/README.md\n");
}

main().catch((error) => {
  console.error("❌ Setup failed:", error);
  process.exit(1);
});
