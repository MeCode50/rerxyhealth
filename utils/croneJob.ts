import cron from "node-cron";
import { cancelExpiredAppointments } from "../controllers/appointment/create_appointment_controller";

// Schedule task to cancel expired appointments every two minutes
cron.schedule('*/2 * * * *', async () => {
  // Call the function to cancel expired appointments
  await cancelExpiredAppointments();
});

// Export any other utility functions if needed
