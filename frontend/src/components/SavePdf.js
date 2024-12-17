import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const SavePdf = (title, head, body, extraDetails = undefined) => {
  const doc = new jsPDF({
    orientation: 'landscape'
  });
  doc.setFont('Times-Roman', 'normal');
  doc.setFontSize(16);
  doc.text(title.replace(/-/g, ' '), 15, 10, { fontSize: 20 });
  if (extraDetails) {
    doc.setFont('Times-Roman', 'bold');
    doc.setFontSize(20);
    doc.text(extraDetails.heading, doc.internal.pageSize.width / 2, 20, { align: 'center', marginTop: 20, marginBottom: 20 });
    doc.setFont('Times-Roman', 'normal');
    doc.setFontSize(12);
    doc.text('', 15, 20);
    doc.text(`${extraDetails.subHead1}: ${extraDetails.subCont1}`, 15, 40, {
      marginTop: 20,
      marginBottom: 20,
      fontSize: 12
    });
    doc.text(`${extraDetails.subHead2}: ${extraDetails.subCont2}`, 15, 50, {
      marginTop: 20,
      marginBottom: 20,
      fontSize: 12
    });
  }
  doc.text('', 15, 20);
  doc.text('', 15, 20);
  autoTable(doc, {
    head: head,
    body: body,
    ...(extraDetails && { startY: 65 })
  });
  if (extraDetails) {
    doc.text('', 15, 20);
    doc.text('', 15, 20);
    doc.setFontSize(16);
    doc.text(
      `${extraDetails.subSign1}${'                                                  '}${extraDetails.subSign2}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 20,
      { align: 'center', marginTop: 20, marginBottom: 20, fontSize: 14 }
    );
  }
  doc.save(title + '.pdf');
};

export default SavePdf;
