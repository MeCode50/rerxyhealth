// utils/passwordUtils.ts
import prisma from "../prisma";
import { Request } from "express";
import { update_password_schema } from "../validations/settings_validations";
import { StatusCode } from "../enums/status";
import bcrypt from "bcrypt";

export const updatePassword = async (
  id: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
) => {
  try {
    const _validateData = await update_password_schema.validate({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    });

    // Retrieve password from user or doctor
    const entity = await prisma.users.findUnique({
      where: { id },
    });

    if (!entity) {
      return { success: false, message: "Entity not found" };
    }

    const comparePassword = await bcrypt.compare(
      currentPassword,
      entity.password,
    );

    if (!comparePassword) {
      return { success: false, message: "Password is not correct" };
    }

    const compareNewPassword = await bcrypt.compare(
      newPassword,
      entity.password,
    );

    if (compareNewPassword) {
      return {
        success: false,
        message: "New password cannot be same as the current password",
      };
    }

    const encryptedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const updatePassword = await prisma.users.update({
      where: { id },
      data: {
        password: encryptedNewPassword,
      },
    });

    if (!updatePassword) {
      return { success: false, message: "Failed to update password" };
    }

    return { success: true, message: "Password has been updated successfully" };
  } catch (error:any) {
    return { success: false, message: error.message };
  }
};
