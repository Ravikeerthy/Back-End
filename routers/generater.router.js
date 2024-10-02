import express from "express";
import { createExcelReport } from "../generatePDF/generateExcel.js";
import { createPDFReport } from "../generatePDF/generatePDF.js";

const generate_router = express.Router();

generate_router.post('/generate_excel', createExcelReport);
generate_router.post('/generate_pdf', createPDFReport);

export default generate_router;