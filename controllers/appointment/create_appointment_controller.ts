import prisma from "../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";``
import { AppointmentStatus } from "@prisma/client";

export const createAppointment = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const requestBody = req.body;

  if (!userId) {
    return res.status(StatusCode.BadRequest).json({ message: "User ID is required" });
  }
try {
  const { date, startTime, endTime, period, appointmentType, doctorId } = requestBody;

  if (period !== "Morning" && period !== "Evening") {
    return res.status(StatusCode.BadRequest).json({ message: "Invalid period" });
    }

  const createAppointment = await prisma.appointment.create({
      data: {
        date,
        startTime,
        endTime,
        appointmentType,
        period: period as "Morning" | "Evening",
        status: AppointmentStatus.Pending,
        usersId: userId, 
        doctorsId: doctorId,
      },
    });

  if (!createAppointment) {
    return res.status(StatusCode.InternalServerError).json({ message: "Failed to create appointment" });
    }

    return res.status(StatusCode.Created).json({
    message: "Appointment created successfully",data: createAppointment,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({ message: "Failed to create appointment" });
  }
};



/*export const completedAppointment = async () => {
  try {
    // Get the current time
    const currentTime = new Date();

    // Logic to update appointments to "Completed"
    const completedAppointments = await prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.Pending,
        endTime: {
          lt: currentTime.toISOString(), 
        },
      },
    });

    // Update status of completed appointments to "Completed"
    await Promise.all(
      completedAppointments.map(async (appointment) => {
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { status: AppointmentStatus.Completed },
        });
      }),
    );

    // Log success message after updating appointments
    console.log("Pending appointments successfully completed.");
  } catch (error) {
    console.error("Error completing appointments:", error);
  }
};*/

export const completedAppointment = async () => {
try {
  const currentTime = new Date();
  const completedAppointments = await prisma.appointment.findMany({
    where: {
    status: AppointmentStatus.Pending,
    endTime: {
    lte: currentTime.toISOString(), 
},
  },
    });

  await Promise.all
    completedAppointments.map(async (appointment) => {
      const endTime = new Date(appointment.endTime);
        
      if (currentTime >= endTime) {
        console.log("Appointment Start Time: ", appointment.startTime);
        console.log("Appointment End Time: ", appointment.endTime);

          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { status: AppointmentStatus.Completed },
         });
        console.log(`Appointment with ID ${appointment.id} has been completed.`);
      }
    });

      console.log("Pending appointments successfully completed.");
    } catch (error) {
      console.error("Error completing appointments:", error);
    }
};


export const cancelAppointment = async (req: Request, res: Response) => {
  
  const userId = req.user?.id;
  const { appointmentId } = req.params;
  try {
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        usersId: userId,
      },
    });

    if (!appointment) {
      return res.status(StatusCode.NotFound).json({
        message: "Appointment not found or does not belong to the user",
      });
    }

    if (appointment.status === AppointmentStatus.Cancelled) {
      return res.status(StatusCode.BadRequest).json({ message: "Appointment is already canceled" });
    }

    const canceledAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.Cancelled },
    });

    return res.status(StatusCode.Success).json({
      message: "Appointment canceled successfully",
      data: canceledAppointment,
    });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    return res.status(StatusCode.InternalServerError).json({ message: "Failed to cancel appointment" });
  }
};