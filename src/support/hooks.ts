import { After, Before, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { ENV } from "../config/env";
import { BrowserHelper } from "../helpers/browser.helper";
import { ScreenshotHelper } from "../helpers/screenshot.helper";
import { CustomWorld } from "./world";

setDefaultTimeout(ENV.TIMEOUT);

Before(async function (this: CustomWorld) {
  this.browser = await BrowserHelper.launchBrowser();
  this.context = await BrowserHelper.createContext(this.browser);

  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(ENV.TIMEOUT);
});

After(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, "-");

  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await ScreenshotHelper.capture(this.page, scenarioName);
    await this.attach(screenshot, "image/png");

    await this.context.tracing.stop({
      path: `test-results/traces/${scenarioName}.zip`,
    });
  } else {
    await this.context.tracing.stop();
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
