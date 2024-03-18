
// Function to calculate subtotal
const calculateSubtotal = (totalAmount: number, serviceFee: number): number => {
  // Ensure totalAmount and serviceFee are valid numbers
  if (
    isNaN(totalAmount) ||
    isNaN(serviceFee) ||
    totalAmount < 0 ||
    serviceFee < 0
  ) {
    throw new Error("Invalid total amount or service fee");
  }

  // Calculate subtotal
  const subtotal = totalAmount + serviceFee;

  // Return the calculated subtotal
  return subtotal;
};

export { calculateSubtotal };
