import { verifyTransaction } from "./verify_transaction";

import { Request, Response } from "express";

export const transEndpoint = async (req: Request, res: Response) => {
  try {
    const reference = req.params.id;

    const transactionDetails = await verifyTransaction(reference);

    res.status(200).json(transactionDetails);
  } catch (error) {
    console.error("error verifying", error);
    res.status(500).json({ error: "an error occoured while verifying" });
  }
};
