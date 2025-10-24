import { execSync } from "node:child_process";
import fs from "node:fs";
import readline from "node:readline";

export const ENV_FILES = [
  { source: "packages/db/.env.example", dest: "packages/db/.env" },
  { source: "apps/app/.env.example", dest: "apps/app/.env.local" },
  { source: "apps/api/.env.example", dest: "apps/api/.env" },
];

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export function copyFile(source: string, destination: string): boolean {
  if (!fs.existsSync(destination)) {
    fs.copyFileSync(source, destination);
    console.log(`✅ Created ${destination}`);
    return true;
  }
  console.log(`⏭️ ${destination} already exists`);
  return false;
}

export function checkDocker() {
  try {
    execSync("docker --version", { stdio: "ignore" });
    console.log("   ✅ Docker installed\n");
  } catch {
    console.log("   ❌ Docker not found. Please install Docker Desktop first.");
    process.exit(1);
  }
}
