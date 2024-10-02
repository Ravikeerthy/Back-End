import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPDFReport = (data) => {
 
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "output.pdf");

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(25).text('Financial Report', { align: 'center' });
  doc.fontSize(12).text(`Income: ${data.income}`);
  doc.fontSize(12).text(`Expenses: ${data.expenses}`);
  doc.fontSize(12).text(`Savings: ${data.savings}`);

  doc.end();

  console.log(`PDF report generated at ${filePath}`);
};


