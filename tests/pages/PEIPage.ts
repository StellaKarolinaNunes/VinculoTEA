import { Page, expect } from '@playwright/test';

export class PEIPage {
    constructor(private page: Page) { }

    async createPEI(year: string, diagnosis: string) {
        await this.page.click('text=Gerar Novo PEI');
        await this.page.fill('label:has-text("Ano Letivo") + input', year);
        await this.page.fill('label:has-text("Diagnóstico") + textarea', diagnosis);
        await this.page.click('text=Salvar PEI');
    }

    async validatePersistence(diagnosis: string) {
        await this.page.reload();
        await expect(this.page.locator(`text=${diagnosis}`)).toBeVisible();
    }

    async duplicatePEI() {
        this.page.once('dialog', dialog => dialog.accept());
        await this.page.click('button:has(svg.lucide-copy)');
    }

    async downloadPDF() {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.page.click('button:has(svg.lucide-download)')
        ]);
        expect(download.suggestedFilename()).toContain('.pdf');
    }

    async printPEI() {
        const printTriggered = await this.page.evaluate(() => {
            return new Promise(resolve => {
                const oldPrint = window.print;
                window.print = () => {
                    window.print = oldPrint;
                    resolve(true);
                };
                // Find and click the print button in UI
                (document.querySelector('button svg.lucide-printer')?.parentElement as any)?.click();
            });
        });
        expect(printTriggered).toBe(true);
    }
}
