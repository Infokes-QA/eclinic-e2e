module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: [
      "src/support/*.ts",
      "src/steps/**/*.ts"
    ],
    paths: ["features/**/*.feature"],
    format: [
      "progress",
      "json:reports/cucumber/cucumber-report.json",
    ],
    timeout: 30000,
    publishQuiet: true
  }
};