import { Page, expect } from '@playwright/test';

export class StudentsPage {
    constructor(private page: Page) { }

    async createStudent(name: string) {
        await this.page.click('text=Matricular Novo');

        // Step 1: Dados Pessoais
        await this.page.fill('input[name="nomeCompleto"]', name);
        await this.page.fill('input[name="dataNascimento"]', '2015-05-20');
        await this.page.fill('input[name="cpf"]', '123.456.789-00');
        await this.page.selectOption('select[name="genero"]', 'M');
        await this.page.click('button:has-text("Próximo")');

        // Step 2: Responsável
        await this.page.fill('input[name="responsavelNome"]', 'Responsável Teste');
        await this.page.fill('input[name="responsavelEmail"]', 'resp@teste.com');
        await this.page.fill('input[name="responsavelTelefone"]', '(11) 99999-9999');
        await this.page.fill('input[name="cep"]', '01001-000');
        await this.page.fill('input[name="logradouro"]', 'Rua Teste');
        await this.page.fill('input[name="numero"]', '123');
        await this.page.fill('input[name="bairro"]', 'Bairro Teste');
        await this.page.fill('input[name="cidade"]', 'São Paulo');
        await this.page.selectOption('select[name="estado"]', 'SP');
        await this.page.click('button:has-text("Próximo")');

        // Step 3: Vínculo
        // We select the first available school and class
        const escolaSelect = this.page.locator('select[name="escolaId"]');
        await escolaSelect.selectOption({ index: 1 });

        const turmaSelect = this.page.locator('select[name="turmaId"]');
        await turmaSelect.waitFor({ state: 'attached' });
        await turmaSelect.selectOption({ index: 1 });

        await this.page.selectOption('select[name="modulo"]', 'Fundamental I');
        await this.page.selectOption('select[name="periodo"]', 'Matutino');
        await this.page.click('button:has-text("Próximo")');

        // Step 4: História
        await this.page.fill('textarea[name="gravidez"]', 'Gravidez normal');
        await this.page.selectOption('select[name="tipoParto"]', 'Normal');
        await this.page.fill('input[name="pesoNascer"]', '3.5kg');
        await this.page.fill('input[name="apgar"]', '9/10');
        await this.page.fill('input[name="internacaoNeonatal"]', 'Não');
        await this.page.click('button:has-text("Próximo")');

        // Step 5: Desenvolvimento
        await this.page.fill('textarea[name="marcosDesenvolvimento"]', 'Marcos normais');
        await this.page.fill('textarea[name="producaoVerbal"]', 'Produção normal');
        await this.page.selectOption('select[name="entendeInstrucoes"]', 'Sim');
        await this.page.fill('input[name="contatoOcular"]', 'Bom');
        await this.page.fill('input[name="brincadeiraPreferida"]', 'Blocos');
        await this.page.click('button:has-text("Próximo")');

        // Step 6: Saúde
        await this.page.fill('textarea[name="doencas"]', 'Nenhuma');
        await this.page.fill('input[name="medicacao"]', 'Nenhuma');
        await this.page.fill('input[name="alergias"]', 'Nenhua');
        await this.page.fill('input[name="sono"]', '8h');
        await this.page.fill('textarea[name="alimentacao"]', 'Normal');
        await this.page.fill('textarea[name="observacoes"]', 'Teste E2E');

        await this.page.click('button:has-text("Finalizar")');
    }

    async openStudentDetail(name: string) {
        // Wait for list to load
        await this.page.waitForSelector(`text=${name}`);
        await this.page.click(`tr:has-text("${name}") >> text=Ver Aluno`);
    }
}
