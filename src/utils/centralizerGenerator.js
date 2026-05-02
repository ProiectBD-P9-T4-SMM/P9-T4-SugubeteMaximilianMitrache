import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadUnicodeFont, PDF_STYLES } from './pdfUtils';

/**
 * Generates a professional e-Grade Centralizer PDF.
 * @param {Object} data The centralized data from the API.
 * @param {Object} filters The filters used to generate the data (for the header).
 * @param {string} language The language to use ('ro' or 'en').
 * @param {Object} lookupData Optional labels for IDs in filters (specialization name, year label, etc).
 */
export const generateCentralizerPDF = async (data, filters, language = 'ro', lookupData = {}) => {
  const { students, student_count, generated_at } = data;
  
  const t = (key) => {
    const ro = {
      title: "CENTRALIZATOR NOTE OFICIAL (e-Grade Centralizer)",
      institution: "Universitatea din Craiova",
      faculty: "Facultatea de Automatică, Calculatoare și Electronică",
      system: "Sistem Integrat de Gestiune Academică (AFSMS Core)",
      academic_year: "Anul Universitar",
      specialization: "Specializare",
      study_year: "Anul de Studiu",
      formation: "Formațiune / Grupă",
      semester: "Semestru",
      eval_type: "Tip Evaluare",
      generated: "Generat la",
      student_count: "Total Studenți",
      th_num: "#",
      th_reg_num: "Nr. Matricol",
      th_student: "Nume și Prenume",
      th_discipline: "Disciplina",
      th_sem: "Sem.",
      th_grade: "Nota",
      th_gpa: "Media",
      th_ects: "ECTS",
      th_formation: "Grupă",
      page: "Pagina",
      of: "din",
      signature_sec: "Secretariat Facultate",
      signature_dean: "Decanat",
      seal: "Ștampila Instituției",
      not_graded: "-",
      absent: "Abs."
    };
    const en = {
      title: "OFFICIAL GRADE CENTRALIZER (e-Grade Centralizer)",
      institution: "University of Craiova",
      faculty: "Faculty of Automation, Computers and Electronics",
      system: "Integrated Academic Management System (AFSMS Core)",
      academic_year: "Academic Year",
      specialization: "Specialization",
      study_year: "Study Year",
      formation: "Formation / Group",
      semester: "Semester",
      eval_type: "Evaluation Type",
      generated: "Generated at",
      student_count: "Total Students",
      th_num: "#",
      th_reg_num: "Reg. Number",
      th_student: "Full Name",
      th_discipline: "Discipline",
      th_sem: "Sem.",
      th_grade: "Grade",
      th_gpa: "GPA",
      th_ects: "ECTS",
      th_formation: "Group",
      page: "Page",
      of: "of",
      signature_sec: "Faculty Secretariat",
      signature_dean: "Dean's Office",
      seal: "Institutional Seal",
      not_graded: "-",
      absent: "Abs."
    };
    return language === 'ro' ? ro[key] : en[key];
  };

  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
  const fontLoaded = await loadUnicodeFont(doc);
  const mainFont = fontLoaded ? PDF_STYLES.fonts.main : PDF_STYLES.fonts.fallback;
  
  doc.setFont(mainFont);
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // 1. Header (Institutional Branding)
  doc.setFillColor(...PDF_STYLES.colors.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text(t('institution'), 14, 18);
  
  doc.setFontSize(10);
  doc.text(t('faculty'), 14, 26);
  doc.text(t('system'), 14, 32);
  
  // Right side of header: Stats
  doc.setFontSize(9);
  doc.text(`${t('generated')}: ${new Date(generated_at).toLocaleString(language === 'ro' ? 'ro-RO' : 'en-US')}`, pageWidth - 14, 18, { align: 'right' });
  doc.text(`${t('student_count')}: ${student_count}`, pageWidth - 14, 24, { align: 'right' });

  // 2. Report Metadata (Filters)
  doc.setTextColor(...PDF_STYLES.colors.primary);
  doc.setFontSize(16);
  doc.text(t('title'), 14, 55);
  doc.setDrawColor(...PDF_STYLES.colors.primary);
  doc.setLineWidth(0.5);
  doc.line(14, 58, pageWidth - 14, 58);

  doc.setFontSize(9);
  let metaY = 68;
  const col1 = 14;
  const col2 = 80;
  const col3 = 150;
  const col4 = 220;

  if (filters.specialization_id) {
    const specName = lookupData.specializationName || filters.specialization_id;
    doc.text(`${t('specialization')}: ${specName}`, col1, metaY);
  }
  if (filters.academic_year_id) {
    const yearLabel = lookupData.academicYearLabel || filters.academic_year_id;
    doc.text(`${t('academic_year')}: ${yearLabel}`, col2, metaY);
  }
  if (filters.study_year) {
    doc.text(`${t('study_year')}: ${filters.study_year}`, col3, metaY);
  }
  if (filters.education_form) {
    doc.text(`Form: ${filters.education_form}`, col4, metaY);
  }

  metaY += 6;
  if (filters.curriculum_id) {
    const currName = lookupData.curriculumName || filters.curriculum_id;
    doc.text(`${t('formation')}: ${filters.group_index || '-'}`, col1, metaY);
    doc.text(`Plan: ${currName}`, col2, metaY);
  }
  if (filters.semester) {
    doc.text(`${t('semester')}: ${filters.semester}`, col3, metaY);
  }
  if (filters.evaluation_type) {
    doc.text(`${t('eval_type')}: ${filters.evaluation_type}`, col4, metaY);
  }

  // 3. Data Table
  const tableRows = [];
  students.forEach((student, sIdx) => {
    const filteredD = student.disciplines.filter(d => !filters.show_only_graded || d.grade);
    filteredD.forEach((d, dIdx) => {
      tableRows.push([
        dIdx === 0 ? sIdx + 1 : '',
        dIdx === 0 ? student.registration_number : '',
        dIdx === 0 ? `${student.last_name} ${student.first_name}` : '',
        dIdx === 0 ? student.formation_code : '',
        d.discipline_name,
        d.semester,
        d.grade !== null ? (parseFloat(d.grade) === 0 ? t('absent') : d.grade) : t('not_graded'),
        dIdx === 0 ? student.average_grade || '-' : '',
        dIdx === 0 ? student.total_ects : ''
      ]);
    });
  });

  autoTable(doc, {
    head: [[t('th_num'), t('th_reg_num'), t('th_student'), t('th_formation'), t('th_discipline'), t('th_sem'), t('th_grade'), t('th_gpa'), t('th_ects')]],
    body: tableRows,
    startY: metaY + 12,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5, font: mainFont },
    headStyles: { fillColor: [...PDF_STYLES.colors.primary], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 20 },
      5: { halign: 'center', cellWidth: 15 },
      6: { halign: 'center', cellWidth: 15 },
      7: { halign: 'center', cellWidth: 15 },
      8: { halign: 'center', cellWidth: 15 },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer on every page
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`${t('page')} ${doc.internal.getNumberOfPages()} ${t('of')} {total_pages}`, pageWidth / 2, 200, { align: 'center' });
    }
  });

  // Replace {total_pages} placeholder
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`${t('page')} ${i} ${t('of')} ${totalPages}`, pageWidth / 2, 200, { align: 'center' });
    doc.text(t('system'), 14, 200);
  }

  // 4. Signatures (Bottom of last page)
  let finalY = doc.lastAutoTable.finalY + 15;
  if (finalY > 170) {
    doc.addPage();
    finalY = 30;
  }

  doc.setTextColor(...PDF_STYLES.colors.primary);
  doc.setFontSize(9);
  doc.text(t('signature_sec'), 14, finalY);
  doc.text(t('signature_dean'), 100, finalY);
  doc.text(t('seal'), 200, finalY);
  
  doc.setDrawColor(226, 232, 240);
  doc.line(14, finalY + 12, 60, finalY + 12);
  doc.line(100, finalY + 12, 140, finalY + 12);
  doc.circle(220, finalY + 10, 10, 'D');

  doc.save(`AFSMS_Centralizer_${new Date().getTime()}.pdf`);
};
