import ExcelJS from "exceljs";

export const createExcelReport = async (req, res) => {
  try {
    const { income, expense, saving, budget } = req.body;
    console.log("Req Body: ", req.body);

    const workbook = new ExcelJS.Workbook();
    const workSheet = workbook.addWorksheet("Financial Report");

    const currentDate = new Date();
    const months = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

      const monthYear = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;


    const titleRow = workSheet.addRow([`Financial Report- ${monthYear}`]);
    titleRow.font = {size:20, bold:true};
    titleRow.alignment = {horizontal:"center"};
    titleRow.fill = {type:"pattern", pattern:"solid", fgColor:{argb:"F79DE5"}}
    workSheet.mergeCells("A1", "F1");

    workSheet.addRow([])

    workSheet.columns = [
      { header: "Category", key: "category", width: 15 },
      { header: "Amount", key: "amount", width: 20 },
      { header: "Source", key: "source", width: 20 },
      { header: "Description", key: "description", width: 20 },
      { header: "Date", key: "date", width: 20 },
      { header: "Frequency", key: "frequency", width: 20 },
    ];

    workSheet.getRow(3).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = { 
        type: "pattern",      
        pattern: "solid",
        fgColor: { argb: "ADD8E6" },
      };
    });
    
    const addSectionHeader = (title) => {
      const row = workSheet.addRow({ category: title });
      row.font = { bold: true, color: { argb: "00000" } };
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      };
      row.alignment = { horizontal: "center" };
    };

    addSectionHeader("Income Details");
    income.forEach((item) => {
      console.log("Adding income row:", item);
      workSheet.addRow({
        category: "Income",
        amount: item.amount || 0,
        source: item.source || "",
        date: item.date || "",
        frequency: item.frequency || "",
      });
    });
    console.log("Income Details: ", workSheet.getSheetValues());

    workSheet.addRow({});
    addSectionHeader("Expense Details");

    expense.forEach((item) => {
      console.log("Adding expense row:", item);
      workSheet.addRow({
        category: "Expense",
        amount: item.amount || 0,
        source: item.source || "",
        date: item.date || "",
        frequency: item.frequency || "",
        description: item.description || "",
      });
    });

    workSheet.addRow({});
    addSectionHeader("Saving Details");

    saving.forEach((item) => {
      console.log("Adding saving row:", item);
      workSheet.addRow({
        category: "Saving",
        amount: item.amount || 0,
        source: item.source || "",
        date: item.date || "",
      });
    });

    workSheet.addRow({});
    addSectionHeader("Budget Details");
    budget.forEach((item) => {
      console.log("Adding saving row:", item);
      workSheet.addRow({
        category: "Budget",
        amount: item.amount || 0,
        source: item.source || "",
        date: item.date || "",
      });
    });

    workSheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.getCell("date").numFmt = "mm-dd-yyyy";
      }

      if (!rowNumber % 2 === 0 && rowNumber > 1) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "E8EAF6" },
        };
      }
      row.alignment = { horizontal: "center" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    console.log("Generated Excel buffer:", buffer);

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
