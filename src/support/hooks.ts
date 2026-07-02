import { After, AfterStep, Before, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { PickleStepType } from "@cucumber/messages";
import fs from "fs";
import { ENV } from "../config/env";
import { AuthHelper } from "../helpers/auth.helper";
import { BrowserHelper } from "../helpers/browser.helper";
import { ScreenshotHelper } from "../helpers/screenshot.helper";
import { CustomWorld } from "./world";

setDefaultTimeout(ENV.TIMEOUT);

function scenarioUsesAuthState(tagNames: string[]): boolean {
  return tagNames.includes("@authenticated") || tagNames.includes("@requiresAuth");
}

Before(async function (this: CustomWorld, scenario) {
  const tagNames = scenario.pickle.tags.map((tag) => tag.name);
  const useAuthState = scenarioUsesAuthState(tagNames) && !tagNames.includes("@login");

  this.browser = await BrowserHelper.launchBrowser();

  if (useAuthState) {
    const role = "admin";
    const statePath = await AuthHelper.ensureAuthState(role);
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

AfterStep(async function (this: CustomWorld, { pickle, pickleStep, result }) {
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
  const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, "-");
  const isFailed = scenario.result?.status === Status.FAILED;
  const statusSuffix = isFailed ? "failed" : "passed";
  const screenshotName = `${scenarioName}-${statusSuffix}`;

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
      path: `${traceDir}/${scenarioName}.zip`,
    });
  } else {
    await this.context.tracing.stop();
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
