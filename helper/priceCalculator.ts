
/**
 * @param totalAmount The total amount of items in the cart.
 * @param additionalFee Any additional fees, such as shipping fees.
 * @returns The calculated subtotal.
 */
const calculateSubtotal = (
  totalAmount: number,
  additionalFee: number,
): number => {
  return totalAmount + additionalFee;
};

export { calculateSubtotal };
