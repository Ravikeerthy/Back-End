import ExcelJS from "exceljs";

export const createExcelReport = async (req, res) => {
  try {
    const { income, expense, saving, budget } = req.body;

    const workbook = new ExcelJS.Workbook();
    const workSheet = workbook.addWorksheet("Financial Report");

    workSheet.columns = [
      { header: "Category", key: "category", width: 15 },
      { header: "Amount", key: "amount", width: 10 },
    ];

    workSheet.addRow({ category: "Income", amount: income || 0 });
    workSheet.addRow({ category: "Expense", amount: expense ||0});
    workSheet.addRow({ category: "Saving", amount: saving || 0});
    workSheet.addRow({ category: "Budget", amount: budget || 0});

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=FinancialReport.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Error generating Excel report", error });
  }
};
