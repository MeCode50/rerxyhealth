import { CartItem } from "./type"; // Assuming you have a CartItem type defined

// Function to calculate total amount based on cart items
const calculateTotalAmount = (cartItems: CartItem[]): number => {
  let totalAmount = 0;

  // Iterate through each cart item and sum up the total amount
  cartItems.forEach((item) => {
    totalAmount += item.amount * item.quantity; // Assuming 'amount' is the price of the product
  });

  return totalAmount;
};

export { calculateTotalAmount };
