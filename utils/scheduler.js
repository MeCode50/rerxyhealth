"use strict";
//import cron from "node-cron";
//import { completedAppointment } from "../controllers/appointment/create_appointment_controller";
// Scheduler to run every minute
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*cron.schedule("* * * * *", async () => {
  try {
    await completedAppointment();
    console.log("Scheduler running successfully. Completed appointments.");
  } catch (error) {
    console.error("Error in scheduler:", error);
  }
});*/
const create_appointment_controller_1 = require("../controllers/appointment/create_appointment_controller");
//import cron from "node-cron";
const cron = require("node-cron");
// Scheduler to run every minute
cron.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Scheduler running...");
        yield (0, create_appointment_controller_1.completedAppointment)();
        //console.log("Scheduler running successfully. Completed appointments.");
    }
    catch (error) {
        console.error("Error in scheduler:", error);
    }
}));
