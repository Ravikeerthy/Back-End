import ExcelJS from "exceljs";


export const createExcelReport = async (req, res) => {
  try {
    const { income, expense, saving, budget } = req.body;

    const workbook = new ExcelJS.Workbook();
    const workSheet = workbook.addWorksheet("Financial Report");

    workSheet.columns = [
      { header: "Category", key: "category", width: 15 },
      { header: "Amount", key: "amount", width: 20 },      
      { header: "Source", key: "source", width: 20 },
      { header: "Description", key: "description", width: 20 },
      { header: "Date", key: "date", width: 20 },
      { header: "Frequency", key: "frequency", width: 20 },
    ];

   
    workSheet.addRow({category:"Income Details"})
   const incomeDetails = income.forEach((item) =>
      workSheet.addRow({
        category: "Income",
        amount: item.incomeAmount || 0,
        source: item.incomeSource || "",
        date: item.date || "",
        frequency: item.frequency || "",
       
      })
    );

    console.log("Income Details: ", incomeDetails);
    
    workSheet.addRow({});
    workSheet.addRow({category:"Expense Details"})

    const expenseDetails = expense.forEach((item) =>
      workSheet.addRow({
        category: "Expense",
        amount: item.expenseAmount || 0,
        source: item.expenseCategory || "",
        date: item.date || "",
        frequency: item.frequency || "",
        description: item.expenseDescription || "",
      })
    );

    console.log("Expense Details: ", expenseDetails);


    workSheet.addRow({});
    workSheet.addRow({category:"Saving Details"})

   const savingDetails =  saving.forEach((item) => {
      workSheet.addRow({
        category: "Saving",
        amount: item.savingAmount || 0,
        source: item.source || "",
        date: item.targetDate || "",
       
      });
    });

    console.log("Saving Details: ", savingDetails);

    workSheet.addRow({});
    workSheet.addRow({category:"budget Details"})
    const budgetDetails = budget.forEach((item) => {
      workSheet.addRow({
        category: "Budget",
        amount: item.budgetAmount || 0,
        source: item.budgetCategory || "",
        description: item.budgetPeriod || "",
      });
    });
    console.log("Budget Details: ", budgetDetails);



    // workSheet.addRow({ category: "Income", amount: income.incomeAmount || 0 });
    // workSheet.addRow({ category: "Expense", amount: expense.expenseAmount ||0});
    // workSheet.addRow({ category: "Saving", amount: saving.savingAmount || 0});
    // workSheet.addRow({ category: "Budget", amount: budget.budgetAmount || 0});

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
