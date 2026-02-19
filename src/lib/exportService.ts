import { supabase } from './supabase';
import { fetchSchoolPDFData, renderModernHeader, renderModernFooter } from './pdfUtils';

export const exportProntuarioPDF = async (data: any) => {
    // Dynamic import to reduce initial bundle size
    const [jsPDFModule, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
    ]);

    const jsPDF = jsPDFModule.default;
    const html2canvas = html2canvasModule.default;

    const doc = new jsPDF('p', 'mm', 'a4');

    // Fetch school info for branding
    let schoolInfo = null;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: userData } = await supabase
                .from('Usuarios')
                .select('Professores(Escola_ID)')
                .eq('auth_uid', user.id)
                .single();

            const escolaId = userData?.Professores?.[0]?.Escola_ID;
            if (escolaId) {
                schoolInfo = await fetchSchoolPDFData(escolaId);
            }
        }
    } catch (error) {
        console.error('Error fetching school info for PDF:', error);
    }

    let contentStartY = 45;

    if (schoolInfo) {
        contentStartY = await renderModernHeader(doc, schoolInfo);
    } else {
        // Fallback Header
        doc.setFillColor(20, 57, 109);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('VÍNCULOTEA', 20, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('PRONTUÁRIO MULTIDISCIPLINAR PREMIUM', 20, 32);
        contentStartY = 50;
    }

    // Add Prontuario Title if modern header used
    if (schoolInfo) {
        contentStartY += 5;
        doc.setFontSize(18);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text('PRONTUÁRIO MULTIDISCIPLINAR', 105, contentStartY, { align: 'center' });
        contentStartY += 10;
    }


    let y = contentStartY + 10;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Paciente/Aluno: ${data.nome}`, 20, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 20, y);

    y += 15;
    doc.setDrawColor(226, 232, 240);
    doc.line(20, y, 190, y); // Separator

    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('Evolução e Diagnóstico:', 20, y);

    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const splitText = doc.splitTextToSize(data.evolucao || 'Nenhum registro de evolução encontrado.', 170);
    doc.text(splitText, 20, y);


    if (schoolInfo) {
        renderModernFooter(doc, schoolInfo);
    } else {
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Página ${i} de ${pageCount} - VínculoTEA | Gestão Multidisciplinar`, 105, 287, { align: 'center' });
        }
    }

    doc.save(`Prontuario_${data.nome.replace(/\s+/g, '_')}.pdf`);
};
