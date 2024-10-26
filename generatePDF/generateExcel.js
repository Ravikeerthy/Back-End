import ExcelJS from "exceljs";


export const createExcelReport = async (req, res) => {
  try {
    const { income, expense, saving, budget } = req.body;
    console.log("Req Body: ", req.body);
    

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
   const incomeDetails = income.forEach((item) =>{
    console.log("Adding income row:", item);
      workSheet.addRow({
        category: "Income",
        incomeAmount: item.incomeAmount || 0,
        incomeSource: item.incomeSource || "",
        date: item.date || "",
        frequency: item.frequency || "",
       
      })
  });

    console.log("Income Details: ", incomeDetails);
    
    workSheet.addRow({});
    workSheet.addRow({category:"Expense Details"})

    const expenseDetails = expense.forEach((item) =>{
      console.log("Adding expense row:", item); 
      workSheet.addRow({
        category: "Expense",
        expenseAmount: item.expenseAmount || 0,
        expenseCategory: item.expenseCategory || "",
        date: item.date || "",
        frequency: item.frequency || "",
        expenseDescription: item.expenseDescription || "",
      })
  });

    console.log("Expense Details: ", expenseDetails);


    workSheet.addRow({});
    workSheet.addRow({category:"Saving Details"})

   const savingDetails =  saving.forEach((item) => {
    console.log("Adding saving row:", item); 
      workSheet.addRow({
        category: "Saving",
        savingAmount: item.savingAmount || 0,
        source: item.source || "",
        targetDate: item.targetDate || "",
       
      });
    });

    console.log("Saving Details: ", savingDetails);

    workSheet.addRow({});
    workSheet.addRow({category:"budget Details"})
    const budgetDetails = budget.forEach((item) => {
      console.log("Adding saving row:", item);
      workSheet.addRow({
        category: "Budget",
        budgetAmount: item.budgetAmount || 0,
        budgetCategory: item.budgetCategory || "",
        budgetPeriod: item.budgetPeriod || "",
      });
    });
    console.log("Budget Details: ", budgetDetails);



    // workSheet.addRow({ category: "Income", amount: income.incomeAmount || 0 });
    // workSheet.addRow({ category: "Expense", amount: expense.expenseAmount ||0});
    // workSheet.addRow({ category: "Saving", amount: saving.savingAmount || 0});
    // workSheet.addRow({ category: "Budget", amount: budget.budgetAmount || 0});

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
