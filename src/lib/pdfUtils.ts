import { jsPDF } from 'jspdf';
import { supabase } from './supabase';

export interface PDFSchoolData {
    logo?: string;
    nome?: string;
    razao_social?: string;
    cnpj?: string;
    telefone?: string;
    endereco?: string;
    email?: string;
    website?: string;
}

export const fetchSchoolPDFData = async (escolaId: number): Promise<PDFSchoolData | null> => {
    try {
        const { data, error } = await supabase
            .from('Escolas')
            .select('Nome, Logo, CNPJ, Telefone, Razao_Social, Endereco, Configuracoes')
            .eq('Escola_ID', escolaId)
            .single();

        if (error) throw error;
        if (!data) return null;

        return {
            logo: data.Logo,
            nome: data.Nome,
            razao_social: data.Razao_Social,
            cnpj: data.CNPJ,
            telefone: data.Telefone,
            endereco: data.Endereco,
            email: data.Configuracoes?.email,
            website: data.Configuracoes?.website
        };
    } catch (err) {
        console.error('Error fetching school PDF data:', err);
        return null;
    }
};

export const renderModernHeader = async (doc: jsPDF, school: PDFSchoolData) => {
    const pageWidth = doc.internal.pageSize.width;
    const primaryColor: [number, number, number] = [37, 99, 235]; // Blue-600
    const secondaryColor: [number, number, number] = [30, 41, 59]; // Slate-800
    const grayColor: [number, number, number] = [100, 116, 139]; // Slate-500

    // Top Brand Bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 2.5, 'F');

    let currentY = 12;
    const logoSize = 25;
    const logoX = 14;

    // Logo Handling
    if (school.logo) {
        try {
            // Load image properly to ensure it exists before adding
            const img = new Image();
            img.src = school.logo;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if error
                if (img.complete) resolve(true);
            });

            const ext = (school.logo.split('.').pop()?.toUpperCase() || 'PNG') as any;
            // Use 'FAST' compression for performance
            doc.addImage(img, ext === 'SVG' ? 'SVG' : ext, logoX, currentY, logoSize, logoSize, undefined, 'FAST');
        } catch (e) {
            console.error('Error adding logo to PDF:', e);
        }
    }

    const textX = 45; // Position text to the right of logo

    // School Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text((school.nome || 'ESCOLA NÃO IDENTIFICADA').toUpperCase(), textX, currentY + 6);

    // Platform Subtitle - Requested "vinculoTEA"
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bolditalic'); // Styled as requested "moreno e elegante"
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Plataforma VínculoTEA', textX, currentY + 10);

    // Separator Line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    doc.line(textX, currentY + 13, pageWidth - 14, currentY + 13);

    // Details Section
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);

    let detailsY = currentY + 18;
    const lineHeight = 3.5;

    // Row 1: Razão Social (if different) + CNPJ
    const row1Parts = [];
    if (school.razao_social && school.razao_social !== school.nome) row1Parts.push(school.razao_social);
    if (school.cnpj) row1Parts.push(`CNPJ: ${school.cnpj}`);

    if (row1Parts.length > 0) {
        doc.text(row1Parts.join('  |  '), textX, detailsY);
        detailsY += lineHeight;
    }

    // Row 2: Contacts
    const row2Parts = [];
    if (school.telefone) row2Parts.push(school.telefone); // Already usually formatted
    if (school.email) row2Parts.push(school.email);
    if (school.website) row2Parts.push(school.website);

    if (row2Parts.length > 0) {
        // Add icons effectively just by spacing or text for now to keep it clean/robust
        doc.text(row2Parts.join('  •  '), textX, detailsY);
        detailsY += lineHeight;
    }

    // Row 3: Address
    if (school.endereco) {
        const addressLines = doc.splitTextToSize(school.endereco, pageWidth - textX - 14);
        doc.text(addressLines, textX, detailsY);
    }

    // Return the Y position where the header ends, so content can start below
    return Math.max(currentY + logoSize + 5, detailsY + 5);
};

export const renderModernFooter = (doc: jsPDF, school: PDFSchoolData) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 15;

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Footer Line
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.1);
        doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');

        // School Name & Branding in Footer
        const leftText = school.nome ? `© ${new Date().getFullYear()} ${school.nome}` : '© VínculoTEA';
        doc.text(leftText, 14, footerY);

        // Center Text - "Documento gerado por VínculoTEA"
        doc.text('Documento Oficial • Plataforma VínculoTEA', pageWidth / 2, footerY, { align: 'center' });

        // Page Number
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, footerY, { align: 'right' });
    }
};
