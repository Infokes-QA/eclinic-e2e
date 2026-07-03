import { setWorldConstructor, World } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "playwright";

import { LoginPage } from "../pages/authentication/LoginPage";
import { LandingPage } from "../pages/landing/LandingPage";
import { CreatePatientPage } from "../pages/patient/CreatePatientPage";
import { RegisterPatientPage } from "../pages/patient/RegisterPatientPage";
import { PatientShowDetailPage } from "../pages/patient/PatientShowDetailPage";
import { SearchPatientPage } from "../pages/patient/SearchPatientPage";
import { RawatJalanIgdPage } from "../pages/pelayanan/RawatJalanIgdPage";
import {
  CreatedPatientSnapshot,
  PatientFormInput,
  RegistrationSnapshot,
} from "../types/patient.type";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  landingPage!: LandingPage;
  createPatientPage!: CreatePatientPage;
  registerPatientPage!: RegisterPatientPage;
  rawatJalanIgdPage!: RawatJalanIgdPage;
  searchPatientPage!: SearchPatientPage;
  patientShowDetailPage!: PatientShowDetailPage;

  authRole?: string;
  patientFormInput?: PatientFormInput;
  createdPatientSnapshot?: CreatedPatientSnapshot;
  registrationSnapshot?: RegistrationSnapshot;

  terminalScenarioStartedAt?: number;
  terminalStepStartedAt?: number;
  terminalStepIndex?: number;
  terminalStepTotal?: number;
  terminalFailedStep?: string;
  terminalFailureMessage?: string;
  terminalReporter?: "compact" | "smoke" | "verbose";
}

setWorldConstructor(CustomWorld);
