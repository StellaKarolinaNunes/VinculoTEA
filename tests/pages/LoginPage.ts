import { Page, expect } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) { }

    async navigate() {
        await this.page.goto('/');
    }

    async login(email: string, pass: string) {
        await this.page.fill('input[type="email"]', email);
        await this.page.fill('input[type="password"]', pass);
        await this.page.click('button[type="submit"]');
    }

    async getErrorMessage() {
        const error = this.page.getByTestId('login-error');
        if (await error.isVisible()) {
            return await error.innerText();
        }
        return null;
    }
}
