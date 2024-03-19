const axios = require("axios");
require("dotenv").config();

//function to verify transaction with paystack 
async function verifyTransaction(reference)