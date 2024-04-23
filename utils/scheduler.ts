//import cron from "node-cron";
//import { completedAppointment } from "../controllers/appointment/create_appointment_controller";
// Scheduler to run every minute

/*cron.schedule("* * * * *", async () => {
  try {
    await completedAppointment();
    console.log("Scheduler running successfully. Completed appointments.");
  } catch (error) {
    console.error("Error in scheduler:", error);
  }
});*/

import { completedAppointment } from "../controllers/appointment/create_appointment_controller";
//import cron from "node-cron";
const cron = require("node-cron");


// Scheduler to run every minute
cron.schedule("* * * * *", async () => {
  try {
    console.log("Scheduler running...");
    await completedAppointment();
    //console.log("Scheduler running successfully. Completed appointments.");
  } catch (error) {
    console.error("Error in scheduler:", error);
  }
});
