const axios = require("axios");
require("dotenv").config();

//function to verify transaction with paystack
export async function verifyTransaction(reference: string) {
  try {
    const response = await axios.get(
      `${process.env.PAYSTACK_VERIFY_URL}/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error verifying transaction", error.response.data);
    throw error;
  }
}
