import { AuthHelper } from "../helpers/auth.helper";
import { Logger } from "../helpers/logger.helper";

async function runAuthSetup(): Promise<void> {
  const role = "admin";

  Logger.info(`Menyiapkan auth state untuk role '${role}'...`);

  AuthHelper.deleteAuthState(role);

  const statePath = await AuthHelper.ensureAuthState(role);

  Logger.success(`Auth state tersimpan di: ${statePath}`);
}

runAuthSetup().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  Logger.error(`Auth setup gagal: ${message}`);
  process.exit(1);
});
