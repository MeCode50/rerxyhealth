import prisma from "../../prisma";
import { Request, Response } from "express";
import { StatusCode } from "../../enums/status";``
import { AppointmentStatus } from "@prisma/client";
import moment from "moment-timezone"


export const createAppointment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { date, startTime, endTime, period, appointmentType, doctorsId } =
    req.body;

  if (!userId) {return res.status(StatusCode.BadRequest).json({ message: "User ID is required" });
  }

  if (!date ||!startTime ||!endTime ||!period ||!appointmentType ||!doctorsId
  ) {return res.status(StatusCode.BadRequest).json({ message: "All fields are required" });
  }

  try {
    const parsedDate = moment.tz(date, "Africa/Lagos");
    const startTimeUTC = moment.tz(`${date} ${startTime}`, "YYYY-MM-DD HH:mm", "Africa/Lagos").toISOString();
    const endTimeUTC = moment.tz(`${date} ${endTime}`, "YYYY-MM-DD HH:mm", "Africa/Lagos").toISOString();

    if (period !== "Morning" && period !== "Evening") {
      return res.status(StatusCode.BadRequest).json({ message: "Invalid period" });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        date: parsedDate.toISOString(), 
        startTime: startTimeUTC,
        endTime: endTimeUTC,
        period,
        appointmentType,
        status: "Pending",
        usersId: userId,
        doctorsId,
      },
    });

    console.log("New Appointment Data:", newAppointment);

    return res.status(StatusCode.Created).json({
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    return res
      .status(StatusCode.InternalServerError)
      .json({ message: "Failed to create appointment" });
  }
};


export const completedAppointment = async () => {
  try {
    // Get the current date and time in Africa/Lagos timezone
    const currentDateTime = moment().tz("Africa/Lagos").toISOString();
    console.log("Current DateTime (Africa/Lagos):", currentDateTime);

    // Find all appointments that should be marked as completed
    const appointmentsToComplete = await prisma.appointment.findMany({
      where: {
        status: "Pending",
        endTime: {
          lte: currentDateTime, 
        },
      },
    });

    if (appointmentsToComplete.length > 0) {
      console.log("Appointments to complete:", appointmentsToComplete);

      // Update the status of all matching appointments to "Completed"
      const updateResults = await prisma.appointment.updateMany({
        where: {
          id: {
            in: appointmentsToComplete.map((appointment) => appointment.id),
          },
        },
        data: {
          status: "Completed",
        },
      });

      console.log("Update results:", updateResults);
    } else {
      console.log("No appointments to complete at this time.");
    }
  } catch (error) {
    console.error("Error in completedAppointment function:", error);
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

export const getUpcomingAppointments = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;

  if (!userId) {return res.status(StatusCode.BadRequest).json({ message: "User ID is required" });
  }

  try {
    console.log("Fetching upcoming appointments for user:", userId);

    const currentDateTime = new Date().toISOString();
    console.log("Current DateTime:", currentDateTime);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        usersId: userId,
        date: {
          gte: currentDateTime,
        },
        status: {
          in: [AppointmentStatus.Pending],
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    console.log("Upcoming Appointments:", upcomingAppointments);

    return res.status(StatusCode.Success).json({message: "Upcoming appointments retrieved successfully",
      data: upcomingAppointments,
    });
  } catch (error) {
    console.error("Error retrieving upcoming appointments:", error);
    return res.status(StatusCode.InternalServerError).json({ message: "Failed to retrieve upcoming appointments" });
  }
};

export const getPastAppointments = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(StatusCode.BadRequest)
      .json({ message: "User ID is required" });
  }

  try {
    const pastAppointments = await prisma.appointment.findMany({
      where: {
        usersId: userId,
        date: {
          lt: new Date().toISOString(),
        },
        status: AppointmentStatus.Completed, 
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(StatusCode.Success).json({
      message: "Past appointments retrieved successfully",
      data: pastAppointments,
    });
  } catch (error) {
    console.error("Error retrieving past appointments:", error);
    return res
      .status(StatusCode.InternalServerError)
      .json({ message: "Failed to retrieve past appointments" });
  }
};

