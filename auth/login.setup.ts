import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/login/login.page";

setup("login", async ({ page }: { page: any }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        process.env.EC_USERNAME!,
        process.env.EC_PASSWORD!,
        process.env.EC_FASKES!
    );

    await page.context().storageState({ path: "auth/user.json" });
});