import { execSync } from "child_process";
import fs from "fs";
import minimist from "minimist";
import path from "path";

const args = minimist(process.argv.slice(2));

const feature = args.feature as string | undefined;
const moduleName = args.module as string | undefined;
const tags = args.tags as string | undefined;
const headed = args.headed === true;
const skipReport = args["skip-report"] === true;

let command = "cucumber-js";

if (feature) {
  command += ` features/${feature}`;
} else if (moduleName) {
  command += ` features/${moduleName}/**/*.feature`;
}

if (tags) {
  command += ` --tags "${tags}"`;
}

process.env.HEADLESS = headed ? "false" : "true";

const reportDir = path.resolve("reports/cucumber");
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

console.log(`Running command: ${command}`);

execSync(command, {
  stdio: "inherit",
  env: process.env,
});

if (!skipReport) {
  execSync("ts-node src/scripts/generate-report.ts", {
    stdio: "inherit",
    env: process.env,
  });
}
