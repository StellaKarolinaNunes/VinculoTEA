import { Page, expect } from '@playwright/test';

export class ManagementPage {
    constructor(private page: Page) { }

    async createSchool(name: string) {
        await this.page.click('text=Nova Unidade');
        await this.page.fill('label:has-text("Nome da Unidade") + input', name);
        await this.page.click('text=Confirmar Cadastro');
    }

    async createTeacher(name: string, email: string) {
        await this.page.click('text=Corpo Docente');
        await this.page.click('text=Novo Profissional');
        await this.page.fill('input[placeholder="Nome completo"]', name);
        await this.page.fill('input[placeholder="email@exemplo.com"]', email);
        await this.page.click('text=Cadastrar');
    }
}
