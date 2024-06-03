import { Request, Response } from "express";
import { update_password_schema } from "../../validations/settings_validations";
import { StatusCode } from "../../enums/status";
import { compare } from "bcrypt";
import prisma from "../../prisma";
const bcrypt = require("bcrypt");

const update_password = async (req: Request, res: Response) => {
  //@ts-ignore
  const id = req?.id;

  try {
    const { current_password, new_password, confirm_new_password } = req.body;
    const _validate_data = await update_password_schema.validate(req.body);

    const encrypted_new_password = await bcrypt.hash(new_password, 10);

    //retrive password from user
    const check_user = await prisma.users.findUnique({
      where: { id },
    });

    const comparePassword = await bcrypt.compare(
      current_password,
      check_user?.password,
    );

    if (!comparePassword) {
      return res.status(StatusCode.BadRequest).send({
        message: "Password is not correct",
      });
    }

    const compare_new_password = await bcrypt.compare(
      new_password,
      check_user?.password,
    );

    if (compare_new_password) {
      return res.status(StatusCode.BadRequest).send({
        message: "New password cant be same as the current password",
      });
    }

    //update user password
    const updatePassword = await prisma.users.update({
      where: { id: id },
      data: {
        password: encrypted_new_password,
      },
    });

    if (!updatePassword) {
      return res.status(StatusCode.InternalServerError).send({
        message: "Failed to update password",
      });
    }

    return res.status(StatusCode.OK).send({
      message: "Password has been updated successfully",
    });
  } catch (err) {
    //@ts-ignore
    const errMsg = err.message;
    return res.status(StatusCode.BadRequest).send({
      message: errMsg,
    });
  }
};

export default update_password;
