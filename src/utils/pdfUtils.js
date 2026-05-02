import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Loads the Roboto font into jsPDF to support Unicode/UTF-8 characters (e.g. Romanian diacritics).
 * @param {jsPDF} doc The jsPDF instance to add the font to.
 * @returns {Promise<boolean>} True if the font was loaded successfully.
 */
export const loadUnicodeFont = async (doc) => {
  try {
    // Fetch a standard Unicode font (Roboto) to support Romanian diacritics
    const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf';
    const response = await fetch(fontUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(new Blob([arrayBuffer]));
    });
    
    doc.addFileToVFS('Roboto-Regular.ttf', base64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    return true;
  } catch (err) {
    console.error('Font loading failed:', err);
    return false;
  }
};

/**
 * Common PDF styling constants for institutional documents
 */
export const PDF_STYLES = {
  colors: {
    primary: [15, 23, 42], // Slate 900
    secondary: [100, 116, 139], // Slate 500
    accent: [37, 99, 235], // Blue 600
    background: [248, 250, 252] // Slate 50
  },
  fonts: {
    main: 'Roboto',
    fallback: 'helvetica'
  }
};
