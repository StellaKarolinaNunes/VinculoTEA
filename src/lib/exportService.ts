import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportProntuarioPDF = async (data: any) => {
    const doc = new jsPDF('p', 'mm', 'a4');


    doc.setFillColor(20, 57, 109); 
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('VÍNCULOTEA', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('PRONTUÁRIO MULTIDISCIPLINAR PREMIUM', 20, 32);


    let y = 60;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text(`Paciente/Aluno: ${data.nome}`, 20, y);

    y += 10;
    doc.setFontSize(10);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 20, y);

    y += 20;
    doc.line(20, y, 190, y); 

    y += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Evolução e Diagnóstico:', 20, y);

    y += 10;
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(data.evolucao || 'Nenhum registro de evolução encontrado.', 170);
    doc.text(splitText, 20, y);


    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${pageCount} - VinculoTEA | Gestão Inclusiva`, 105, 285, { align: 'center' });
    }

    doc.save(`Prontuario_${data.nome.replace(/\s+/g, '_')}.pdf`);
};
