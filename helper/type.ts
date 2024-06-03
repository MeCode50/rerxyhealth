
interface CartItem {
  id: string; // Unique identifier for the cart item
  image: string; // Image URL of the product
  title: string; // Name or title of the product
  amount: number; // Price of the product
  delivery: string; // Delivery details of the product
  quantity: number; // Quantity of the product in the cart
}

export { CartItem };
