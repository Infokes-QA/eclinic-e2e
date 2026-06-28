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
      "html:reports/cucumber/cucumber-report.html"
    ],
    timeout: 30000,
    publishQuiet: true
  }
};