import { Request, Response } from "express";
//import { update_password_schema } from "../../validations/settings_validations";
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

if (new_password !== confirm_new_password) {
  return res.status(StatusCode.BadRequest).send({message: "Passwords do not match",});
    }

const doctor = await prisma.doctors.findUnique({where: { id },});

if (!doctor) {
  return res.status(StatusCode.NotFound).send({message: "Doctor not found", });
  }

const comparePassword = await compare(current_password, doctor.password);

if (!comparePassword) {
  return res.status(StatusCode.Unauthorized).send({message: "Current password is incorrect",});
  }

const compareNewPassword = await compare(new_password, doctor.password);

if (compareNewPassword) {
  return res.status(StatusCode.BadRequest).send({message: "New password cannot be the same as the current password",});
    }

const encryptedNewPassword = await hash(new_password, 10);

  await prisma.doctors.update({where: { id },
  data: {password: encryptedNewPassword,},
    });

  return res.status(StatusCode.OK).send({message: "Password has been updated successfully",});
  } catch (err) {console.error("Error updating password:", err);
    return res.status(StatusCode.InternalServerError).send({message: "Failed to update password"});
  }
};
// update doctor  profile 

const editDoctorProfile = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
const id = req.id;
const { firstName, lastName, country, state } = req.body;
const updatedDoctor = await prisma.doctors.update({where: { id },
      data: {
        firstName,
        lastName,
        country,
        state,
      },
    });

return res.status(200).json({message: "Doctor profile updated successfully",
doctor: updatedDoctor,
});
  } catch (error) {console.error("Error updating doctor profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateNotificationSettings = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
const id = req.id;
const {
      soundEnabled,
      vibrationEnabled,
      inviteFriendsEnabled
    } = req.body;
    // update notification in database 
    await prisma.doctors.update({
      where: { id },
      data: {
        soundEnabled,
        vibrationEnabled,
        inviteFriendsEnabled
      }
    });
    res.status(200).json({ message: "Notification settings updated successfully" });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({message:"internal server error"})
  }
}
export { updateDoctorPassword, editDoctorProfile, updateNotificationSettings };
