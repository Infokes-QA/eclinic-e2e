import {
  After,
  AfterAll,
  AfterStep,
  Before,
  BeforeStep,
  Status,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { PickleStepType } from "@cucumber/messages";
import fs from "fs";
import { ENV } from "../config/env";
import { AuthHelper } from "../helpers/auth.helper";
import { BrowserHelper } from "../helpers/browser.helper";
import { ScreenshotHelper } from "../helpers/screenshot.helper";
import { CustomWorld } from "./world";

setDefaultTimeout(ENV.TIMEOUT);

let runHeaderPrinted = false;
let runStartedAt = Date.now();

type TerminalReporter = "compact" | "smoke" | "verbose";

interface TerminalSummaryCount {
  passed: number;
  failed: number;
  skipped: number;
  other: number;
}

const terminalSummary = {
  scenarios: {
    passed: 0,
    failed: 0,
    skipped: 0,
    other: 0,
  },
  steps: {
    passed: 0,
    failed: 0,
    skipped: 0,
    other: 0,
  },
};

function stepTypeLabel(type?: PickleStepType): string {
  switch (type) {
    case PickleStepType.CONTEXT:
      return "Given";

    case PickleStepType.ACTION:
      return "When";

    case PickleStepType.OUTCOME:
      return "Then";

    default:
      return "Step";
  }
}

function elapsed(startedAt?: number): string {
  if (!startedAt) {
    return "0.00s";
  }

  return `${((Date.now() - startedAt) / 1000).toFixed(2)}s`;
}

function color(value: string, code: number): string {
  if (!process.stdout.isTTY || process.env.NO_COLOR || process.env.TERMINAL_COLOR === "false") {
    return value;
  }

  return `\x1b[${code}m${value}\x1b[0m`;
}

function statusLabel(status: string): string {
  switch (status) {
    case Status.PASSED:
      return color("PASS", 32);

    case Status.FAILED:
      return color("FAIL", 31);

    case Status.SKIPPED:
      return color("SKIP", 33);

    default:
      return color(status, 36);
  }
}

function incrementSummary(count: TerminalSummaryCount, status: string): void {
  switch (status) {
    case Status.PASSED:
      count.passed += 1;
      break;

    case Status.FAILED:
      count.failed += 1;
      break;

    case Status.SKIPPED:
      count.skipped += 1;
      break;

    default:
      count.other += 1;
      break;
  }
}

function totalCount(count: TerminalSummaryCount): number {
  return count.passed + count.failed + count.skipped + count.other;
}

function padCell(value: string | number, width: number): string {
  return String(value).padEnd(width, " ");
}

function summaryRow(
  status: string,
  scenarioCount: number,
  stepCount: number,
  duration = "-",
): string {
  return `| ${padCell(status, 8)} | ${padCell(scenarioCount, 9)} | ${padCell(
    stepCount,
    5,
  )} | ${padCell(duration, 8)} |`;
}

function logSummaryTable(): void {
  const scenarioTotal = totalCount(terminalSummary.scenarios);
  const stepTotal = totalCount(terminalSummary.steps);

  logProgress("");
  logProgress("TEST SUMMARY");
  logProgress("------------------------------------------------------------");
  logProgress("| Status   | Scenarios | Steps | Duration |");
  logProgress("|----------|-----------|-------|----------|");
  logProgress(summaryRow("PASS", terminalSummary.scenarios.passed, terminalSummary.steps.passed));
  logProgress(summaryRow("FAIL", terminalSummary.scenarios.failed, terminalSummary.steps.failed));
  logProgress(summaryRow("SKIP", terminalSummary.scenarios.skipped, terminalSummary.steps.skipped));

  if (terminalSummary.scenarios.other > 0 || terminalSummary.steps.other > 0) {
    logProgress(summaryRow("OTHER", terminalSummary.scenarios.other, terminalSummary.steps.other));
  }

  logProgress(summaryRow("TOTAL", scenarioTotal, stepTotal, elapsed(runStartedAt)));
  logProgress("------------------------------------------------------------");
}

function formatTags(tags: string[]): string {
  const uniqueTags = [...new Set(tags)];

  return uniqueTags.length ? uniqueTags.join(" ") : "-";
}

function logProgress(message: string): void {
  if (ENV.TERMINAL_PROGRESS) {
    console.log(message);
  }
}

function logRunHeader(tagNames: string[]): void {
  if (runHeaderPrinted) {
    return;
  }

  runHeaderPrinted = true;
  runStartedAt = Date.now();

  logProgress("");
  logProgress("ECLINIC E2E RUN");
  logProgress(
    `Env: ${ENV.ENVIRONMENT} | Browser: ${ENV.BROWSER} | Mode: ${
      ENV.HEADLESS ? "headless" : "headed"
    } | Tags: ${formatTags(tagNames)}`,
  );
}

function resolveTerminalReporter(tagNames: string[]): TerminalReporter {
  const configuredReporter = ENV.TERMINAL_REPORTER.toLowerCase();

  if (configuredReporter === "compact") {
    return "compact";
  }

  if (configuredReporter === "smoke") {
    return "smoke";
  }

  if (configuredReporter === "verbose") {
    return "verbose";
  }

  if (tagNames.includes("@regression")) {
    return "compact";
  }

  if (tagNames.includes("@smoke")) {
    return "smoke";
  }

  return "verbose";
}

function shouldPrintScenarioDetail(reporter: TerminalReporter): boolean {
  return reporter !== "compact";
}

function shouldPrintPassedStep(reporter: TerminalReporter): boolean {
  return reporter !== "compact";
}

function logScenarioStart(name: string, tagNames: string[], reporter: TerminalReporter): void {
  if (reporter === "compact") {
    logProgress(`[RUN ] ${name}`);
    return;
  }

  logProgress("");
  logProgress(`SCENARIO: ${name}`);
  logProgress(`Type    : ${reporter}`);
  if (reporter === "verbose") {
    logProgress(`Tags    : ${formatTags(tagNames)}`);
  }
  logProgress("------------------------------------------------------------");
}

function scenarioUsesAuthState(tagNames: string[]): boolean {
  return tagNames.includes("@authenticated") || tagNames.includes("@requiresAuth");
}

Before(async function (this: CustomWorld, scenario) {
  const tagNames = scenario.pickle.tags.map((tag) => tag.name);
  const useAuthState = scenarioUsesAuthState(tagNames) && !tagNames.includes("@login");

  logRunHeader(tagNames);

  this.terminalReporter = resolveTerminalReporter(tagNames);
  this.terminalScenarioStartedAt = Date.now();
  this.terminalStepIndex = 0;
  this.terminalStepTotal = scenario.pickle.steps.length;
  this.terminalFailedStep = undefined;
  this.terminalFailureMessage = undefined;

  logScenarioStart(scenario.pickle.name, tagNames, this.terminalReporter);

  this.browser = await BrowserHelper.launchBrowser();

  if (useAuthState) {
    const role = "admin";
    const statePath = await AuthHelper.ensureValidAuthState(role);
    this.context = await BrowserHelper.createContext(this.browser, statePath);
    this.authRole = role;
  } else {
    this.context = await BrowserHelper.createContext(this.browser);
  }

  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(ENV.TIMEOUT);
});

BeforeStep(async function (this: CustomWorld) {
  this.terminalStepStartedAt = Date.now();
});

AfterStep(async function (this: CustomWorld, { pickle, pickleStep, result }) {
  const status = result?.status ?? Status.UNKNOWN;
  const label = stepTypeLabel(pickleStep.type);
  const currentStep = (this.terminalStepIndex ?? 0) + 1;
  const totalStep = this.terminalStepTotal ?? pickle.steps.length;
  const stepNo = `${currentStep}/${totalStep}`.padStart(5, " ");
  const stepDuration = elapsed(this.terminalStepStartedAt).padStart(7, " ");
  const reporter = this.terminalReporter ?? "verbose";

  this.terminalStepIndex = currentStep;
  incrementSummary(terminalSummary.steps, status);

  if (status === Status.FAILED) {
    this.terminalFailedStep = `${label} ${pickleStep.text}`;
    this.terminalFailureMessage = result?.message;
  }

  if (status !== Status.PASSED || shouldPrintPassedStep(reporter)) {
    logProgress(
      `${stepNo}  ${statusLabel(status).padEnd(4, " ")}  ${stepDuration}  ${label} ${pickleStep.text}`,
    );
  }

  if (pickleStep.type !== PickleStepType.OUTCOME) {
    return;
  }

  const statusSuffix = result?.status === Status.FAILED ? "failed" : "passed";

  try {
    if (!this.page || this.page.isClosed()) {
      return;
    }

    await ScreenshotHelper.attachThenStepScreenshot(
      {
        page: this.page,
        attach: (data, options) => this.attach(data, options),
      },
      pickle.name,
      pickleStep.text,
      statusSuffix,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await this.attach(`Screenshot Then step gagal diambil: ${message}`, "text/plain");
  }
});

After(async function (this: CustomWorld, scenario) {
  const scenarioName = ScreenshotHelper.sanitizeFileName(scenario.pickle.name);
  const isFailed = scenario.result?.status === Status.FAILED;
  const statusSuffix = isFailed ? "failed" : "passed";
  const screenshotName = `${scenarioName}-${statusSuffix}`;
  const screenshotPath = `screenshots/${screenshotName}.png`;
  const tracePath = `test-results/traces/${scenarioName}.zip`;
  const scenarioStatus = scenario.result?.status ?? Status.UNKNOWN;
  const reporter = this.terminalReporter ?? "verbose";

  incrementSummary(terminalSummary.scenarios, scenarioStatus);

  try {
    if (this.page && !this.page.isClosed()) {
      const screenshot = await ScreenshotHelper.capture(this.page, screenshotName);
      await this.attach(screenshot, {
        mediaType: "image/png",
        fileName: `${screenshotName}.png`,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await this.attach(`Screenshot gagal diambil: ${message}`, "text/plain");
  }

  if (isFailed) {
    const traceDir = "test-results/traces";
    if (!fs.existsSync(traceDir)) {
      fs.mkdirSync(traceDir, { recursive: true });
    }

    await this.context.tracing.stop({
      path: tracePath,
    });
  } else {
    await this.context.tracing.stop();
  }

  if (shouldPrintScenarioDetail(reporter)) {
    logProgress("------------------------------------------------------------");
    logProgress(
      `${statusLabel(scenarioStatus)}  ${scenario.pickle.name} (${elapsed(
        this.terminalScenarioStartedAt,
      )})`,
    );
  } else {
    logProgress(
      `[${statusLabel(scenarioStatus)}] ${scenario.pickle.name} (${elapsed(
        this.terminalScenarioStartedAt,
      )})`,
    );
  }

  if (isFailed) {
    logProgress(`FAILED  : ${this.terminalFailedStep ?? scenario.pickle.name}`);

    if (this.terminalFailureMessage) {
      const firstErrorLine = this.terminalFailureMessage.split(/\r?\n/).find(Boolean);
      logProgress(`ERROR   : ${firstErrorLine ?? this.terminalFailureMessage}`);
    }

    logProgress("EVIDENCE:");
    logProgress(`  Screenshot : ${screenshotPath}`);
    logProgress(`  Trace      : ${tracePath}`);
  } else {
    if (reporter === "verbose") {
      logProgress(`EVIDENCE: ${screenshotPath}`);
    }
  }

  if (shouldPrintScenarioDetail(reporter)) {
    logProgress("------------------------------------------------------------");
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});

AfterAll(function () {
  logSummaryTable();
});
