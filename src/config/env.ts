import dotenv from "dotenv";

dotenv.config();

export type Environment = "DEV1" | "DEV2" | "DEV3" | "DEV4" | "UAT";

function getEnvironment(): Environment {
  const environment = process.env.ENVIRONMENT as Environment;

  const availableEnvironments: Environment[] = ["DEV1", "DEV2", "DEV3", "DEV4", "UAT"];

  if (!environment || !availableEnvironments.includes(environment)) {
    throw new Error(
      `Invalid ENVIRONMENT '${process.env.ENVIRONMENT}'.
Available environments: ${availableEnvironments.join(", ")}`,
    );
  }

  return environment;
}

export const ACTIVE_ENVIRONMENT = getEnvironment();

export const ENV = {
  ENVIRONMENT: ACTIVE_ENVIRONMENT,

  BASE_URL: process.env[`${ACTIVE_ENVIRONMENT}_BASE_URL`] || "",

  CLINIC_NAME: process.env[`${ACTIVE_ENVIRONMENT}_CLINIC`] || "",

  USERNAME: process.env[`${ACTIVE_ENVIRONMENT}_USERNAME`] || "",

  PASSWORD: process.env[`${ACTIVE_ENVIRONMENT}_PASSWORD`] || "",

  HEADLESS: process.env.HEADLESS === "true",

  TERMINAL_PROGRESS: process.env.TERMINAL_PROGRESS !== "false",

  TERMINAL_REPORTER: process.env.TERMINAL_REPORTER || "auto",

  BROWSER: process.env.BROWSER || "chromium",

  TIMEOUT: Number(process.env.TIMEOUT) || 15000,

  OPTIONAL_DIALOG_TIMEOUT: Number(process.env.OPTIONAL_DIALOG_TIMEOUT) || 2000,

  AUTH_STATE_MAX_AGE_HOURS: Number(process.env.AUTH_STATE_MAX_AGE_HOURS) || 24,

  AUTH_DEFAULT_MENU: process.env.AUTH_DEFAULT_MENU || "patientManagement",

  AUTH_DEFAULT_SUBMENU: process.env.AUTH_DEFAULT_SUBMENU || "pratama",

  AUTH_HOME_QUERY: process.env.AUTH_HOME_QUERY || "broadcastNotif=1",
};
