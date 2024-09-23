import corn from "node-cron";

import triggerRecurringTransactions from "../services/triggerRecurringTransactions.js";

// Schedule the job to run daily at midnight
corn.schedule("0 0 * * *", async () => {
  try {
    await triggerRecurringTransactions();

    console.log("Scheduled job for recurring transactions executed");
  } catch (error) {
    console.error("Error in scheduled job:", error);
  }
});
