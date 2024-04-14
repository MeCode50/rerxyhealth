import { Request, Response } from "express";
import { update_password_schema } from "../../validations/settings_validations";
import { StatusCode } from "../../enums/status";
import prisma from "../../prisma";
import { compare, hash } from "bcrypt";


const updateDoctorPassword = async (req: Request, res: Response) => {
  try {
  //@ts-ignore
    const id = req.id;

    const { current_password, new_password, confirm_new_password } = req.body;

    // Validate input data
    /*const validationResult = update_password_schema.validate({
      current_password,
      new_password,
      confirm_new_password,
    });

    if (validationResult.error) {
      return res.status(StatusCode.BadRequest).send({
        message: "Invalid input data",
        details: validationResult.error.details,
      });
    }*/

    // Check if the new password matches the confirmed new password
    if (new_password !== confirm_new_password) {
      return res.status(StatusCode.BadRequest).send({
        message: "Passwords do not match",
      });
    }

    // Retrieve doctor's data from the database
    const doctor = await prisma.doctors.findUnique({
      where: { id },
    });

    if (!doctor) {
      return res.status(StatusCode.NotFound).send({
        message: "Doctor not found",
      });
    }

    // Compare the current password provided with the one stored in the database
    const comparePassword = await compare(current_password, doctor.password);

    if (!comparePassword) {
      return res.status(StatusCode.Unauthorized).send({
        message: "Current password is incorrect",
      });
    }

    // Check if the new password is different from the current one
    const compareNewPassword = await compare(new_password, doctor.password);

    if (compareNewPassword) {
      return res.status(StatusCode.BadRequest).send({
        message: "New password cannot be the same as the current password",
      });
    }

    // Encrypt the new password before updating it in the database
    const encryptedNewPassword = await hash(new_password, 10);

    // Update doctor's password
    await prisma.doctors.update({
      where: { id },
      data: {
        password: encryptedNewPassword,
      },
    });

    return res.status(StatusCode.OK).send({
      message: "Password has been updated successfully",
    });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(StatusCode.InternalServerError).send({
      message: "Failed to update password",
    });
  }
};

export default updateDoctorPassword;
