import corn from "node-cron";
import User from "../models/user.schema.js";
import { check_CreateRecurringTransaction } from "../services/recurringTransactions.js";


corn.schedule("* * * * *", async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      await check_CreateRecurringTransaction(user._id);
    }

    console.log(
      "Scheduled job for recurring transactions executed for all users"
    );
  } catch (error) {
    console.error("Error in scheduled job:", error);
  }
});
