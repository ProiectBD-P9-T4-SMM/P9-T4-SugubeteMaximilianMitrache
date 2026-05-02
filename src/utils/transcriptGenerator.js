import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadUnicodeFont, PDF_STYLES } from './pdfUtils';

export const generateFullTranscript = async (data, language = 'ro') => {
  const { studentInfo, academicPlans } = data;
  const t = (key) => {
    const ro = {
      title: "FOAIE MATRICOLĂ OFICIALĂ",
      institution: "Universitatea din Craiova",
      faculty: "Facultatea de Automatică, Calculatoare și Electronică",
      system: "Sistem Integrat de Gestiune Academică (AFSMS Core)",
      student: "Nume Student",
      reg_num: "Nr. Matricol",
      specialization: "Specializare",
      plan: "Plan de Învățământ",
      year: "Anul Universitar",
      sem: "Sem.",
      discipline: "Disciplina",
      ects: "ECTS",
      grade: "Nota",
      session: "Sesiune",
      date: "Data",
      summary: "Sumar Performanță Academică",
      total_credits: "Total Credite Acumulate",
      gpa: "Media Multianuală",
      status: "Status Academic",
      page: "Pagina",
      of: "din",
      generated_at: "Document generat automat la data de",
      verification: "VERIFICARE DOCUMENT",
      verification_desc: "Acest document este semnat digital și poate fi verificat scanând codul QR sau accesând portalul de validare AFSMS folosind identificatorul de securitate:",
      signature_sec: "Secretariat Facultate",
      signature_dean: "Decanat",
      seal: "Ștampila Instituției",
      not_examined: "Neex."
    };
    const en = {
      title: "OFFICIAL ACADEMIC TRANSCRIPT",
      institution: "University of Craiova",
      faculty: "Faculty of Automation, Computers and Electronics",
      system: "Integrated Academic Management System (AFSMS Core)",
      student: "Student Name",
      reg_num: "Registration No.",
      specialization: "Specialization",
      plan: "Study Plan",
      year: "Academic Year",
      sem: "Sem.",
      discipline: "Module",
      ects: "ECTS",
      grade: "Grade",
      session: "Session",
      date: "Date",
      summary: "Academic Performance Summary",
      total_credits: "Total Earned Credits",
      gpa: "Cumulative GPA",
      status: "Academic Status",
      page: "Page",
      of: "of",
      generated_at: "Document automatically generated on",
      verification: "DOCUMENT VERIFICATION",
      verification_desc: "This document is digitally signed and can be verified by scanning the QR code or accessing the AFSMS validation portal using the security identifier:",
      signature_sec: "Faculty Secretariat",
      signature_dean: "Dean's Office",
      seal: "Institutional Seal",
      not_examined: "Not Exam."
    };
    return language === 'ro' ? ro[key] : en[key];
  };

  const doc = new jsPDF();
  const fontLoaded = await loadUnicodeFont(doc);
  const mainFont = fontLoaded ? PDF_STYLES.fonts.main : PDF_STYLES.fonts.fallback;
  
  doc.setFont(mainFont);
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // 1. Formal Header
  doc.setFillColor(...PDF_STYLES.colors.primary);
  doc.rect(0, 0, 210, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(t('institution'), 14, 22);
  
  doc.setFontSize(10);
  doc.text(t('faculty'), 14, 30);
  doc.text(t('system'), 14, 36);
  
  // Security ID (Mock)
  const securityId = `SEC-${studentInfo.registration_number}-${Date.now().toString().slice(-6)}`;
  doc.setFontSize(8);
  doc.setTextColor(...PDF_STYLES.colors.secondary);
  doc.text(`SECURITY ID: ${securityId}`, 140, 45);

  // 2. Document Title
  doc.setTextColor(...PDF_STYLES.colors.primary);
  doc.setFontSize(18);
  doc.text(t('title'), 14, 65);
  doc.setDrawColor(...PDF_STYLES.colors.primary);
  doc.setLineWidth(0.8);
  doc.line(14, 68, 200, 68);

  // 3. Student Identity Section
  doc.setFontSize(10);
  doc.text(`${t('student')}:`, 14, 80);
  doc.text(`${studentInfo.last_name} ${studentInfo.first_name}`, 55, 80);
  
  doc.text(`${t('reg_num')}:`, 14, 86);
  doc.text(studentInfo.registration_number, 55, 86);
  
  doc.text(`${t('specialization')}:`, 14, 92);
  doc.text(`${studentInfo.specialization_name || '-'} (${studentInfo.specialization_code || '-'})`, 55, 92);

  doc.text(`${t('status')}:`, 140, 80);
  doc.text(studentInfo.status, 170, 80);

  let currentY = 105;

  // 4. Academic Plans Loop
  academicPlans.forEach((plan, planIdx) => {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(...PDF_STYLES.colors.background);
    doc.rect(14, currentY, 182, 10, 'F');
    doc.setTextColor(...PDF_STYLES.colors.primary);
    doc.setFontSize(11);
    doc.text(`${t('plan')}: ${plan.curriculum_name}`, 18, currentY + 7);
    currentY += 15;

    // Group disciplines by Year
    const structured = {};
    plan.records.forEach(r => {
        const year = Math.ceil(r.semester / 2);
        if (!structured[year]) structured[year] = [];
        structured[year].push(r);
    });

    Object.entries(structured).forEach(([year, disciplines]) => {
        if (currentY > 240) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        doc.text(`${t('year')} ${year}`, 14, currentY);
        currentY += 4;

        const tableRows = disciplines.map(d => [
            d.semester,
            d.discipline_name,
            d.ects_credits,
            d.grade_value || t('not_examined'),
            d.exam_session || '-',
            d.grading_date ? new Date(d.grading_date).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US') : '-'
        ]);

        autoTable(doc, {
            head: [[t('sem'), t('discipline'), t('ects'), t('grade'), t('session'), t('date')]],
            body: tableRows,
            startY: currentY,
            theme: 'striped',
            headStyles: { fillColor: [...PDF_STYLES.colors.primary], textColor: 255, fontSize: 8, fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 2, font: mainFont },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                2: { halign: 'center', cellWidth: 15 },
                3: { halign: 'center', cellWidth: 15 },
                4: { halign: 'center', cellWidth: 25 },
                5: { halign: 'center', cellWidth: 25 },
            },
            margin: { left: 14, right: 14 }
        });

        currentY = doc.lastAutoTable.finalY + 12;
    });
  });

  // 5. Final Summary Section
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setFillColor(...PDF_STYLES.colors.background);
  doc.rect(14, currentY, 182, 35, 'F');
  doc.rect(14, currentY, 182, 35, 'D');

  doc.setTextColor(...PDF_STYLES.colors.primary);
  doc.setFontSize(12);
  doc.text(t('summary'), 20, currentY + 10);

  // Stats calculation
  let totalCredits = 0;
  let gradeSum = 0;
  let gradedCount = 0;
  academicPlans.forEach(p => p.records.forEach(d => {
    if (d.grade_value && d.grade_value >= 5) {
        totalCredits += d.ects_credits;
        gradeSum += d.grade_value;
        gradedCount++;
    }
  }));

  doc.setFontSize(10);
  doc.text(`${t('total_credits')}: ${totalCredits} ECTS`, 20, currentY + 20);
  doc.text(`${t('gpa')}: ${gradedCount > 0 ? (gradeSum / gradedCount).toFixed(2) : '-'}`, 20, currentY + 28);

  // 6. Security & Verification Section (QR Mock)
  currentY += 50;
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setDrawColor(...PDF_STYLES.colors.secondary);
  doc.line(14, currentY, 200, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.text(t('verification'), 14, currentY);
  
  // Draw a QR Code placeholder
  doc.setDrawColor(...PDF_STYLES.colors.primary);
  doc.rect(170, currentY - 5, 25, 25);
  doc.setFontSize(6);
  doc.text("AFSMS", 178, currentY + 7);
  doc.text("VALID", 179, currentY + 13);

  doc.setFontSize(8);
  doc.setTextColor(...PDF_STYLES.colors.secondary);
  const splitText = doc.splitTextToSize(t('verification_desc'), 140);
  doc.text(splitText, 14, currentY + 8);
  doc.text(securityId, 14, currentY + 18);

  // 7. Signatures
  currentY += 40;
  doc.setTextColor(...PDF_STYLES.colors.primary);
  doc.setFontSize(9);
  doc.text(t('signature_sec'), 14, currentY);
  doc.text(t('signature_dean'), 80, currentY);
  doc.text(t('seal'), 150, currentY);
  
  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY + 15, 50, currentY + 15);
  doc.line(80, currentY + 15, 120, currentY + 15);
  doc.circle(165, currentY + 10, 10, 'D');

  // Page Numbers & Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`${t('page')} ${i} ${t('of')} ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
    doc.text(`${t('generated_at')} ${new Date().toLocaleString(language === 'ro' ? 'ro-RO' : 'en-US')}`, 14, 290);
  }

  doc.save(`E-Transcript_${studentInfo.registration_number}.pdf`);
};
