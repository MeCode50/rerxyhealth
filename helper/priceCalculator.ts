
/**
 * @param totalAmount 
 * @param additionalFee 
 * @returns 
 */
const calculateSubtotal = (
  totalAmount: number,
  additionalFee: number,
): number => {
  return totalAmount + additionalFee;
};

export { calculateSubtotal };
