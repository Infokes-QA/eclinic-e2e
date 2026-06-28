import { execSync } from "child_process";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));

const feature = args.feature as string | undefined;
const moduleName = args.module as string | undefined;
const tags = args.tags as string | undefined;
const headed = args.headed === true;

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

console.log(`Running command: ${command}`);

execSync(command, {
  stdio: "inherit",
  env: process.env,
});
