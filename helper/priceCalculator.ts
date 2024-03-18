import { CartItem } from "./type"; 

// Function to calculate total amount based on cart items
const calculateTotalAmount = (cartItems: CartItem[]): number => {
  let totalAmount = 0;

  // Iterate through each cart item and sum up the total amount
  cartItems.forEach((item) => {
    totalAmount += item.amount * item.quantity; 
  });

  return totalAmount;
};

export { calculateTotalAmount };
