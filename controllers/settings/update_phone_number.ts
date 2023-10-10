import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { update_number_schema } from "../../validations/settings_validations";
import { StatusCode } from "../../enums/status";
import { compare } from "bcrypt";
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const update_phone_number = async (req: Request, res: Response) => {
  //@ts-ignore
  const id = req?.id;

  try {
    const _validate_data = await update_number_schema.validate(req.body);
    const { new_number, old_number } = _validate_data;

    //check if number matches in the DB
    const checkNumber = await prisma.users.findUnique({
      where: { id },
    });

    if (old_number !== checkNumber?.phoneNumber) {
      return res.status(StatusCode.BadRequest).send({
        message: "Current phone number dosnt match",
      });
    }

    //update user password
    const updateNumber = await prisma.users.update({
      where: { id: id },
      data: {
        phoneNumber: new_number,
      },
    });

    if (!updateNumber) {
      return res.status(StatusCode.InternalServerError).send({
        message: "Failed to update Phone number",
      });
    }

    return res.status(StatusCode.OK).send({
      message: "Phone number has been updated successfully",
    });
  } catch (err) {
    //@ts-ignore
    const errMsg = err.message;
    return res.status(StatusCode.BadRequest).send({
      message: errMsg,
    });
  }
};

export default update_phone_number;
