import { IDataFetchCart } from "type/component";

export const calculateSubtotal = (cart: IDataFetchCart) => {
  let subtotal = 0;
  if (cart && cart.products?.length) {
    cart.products.forEach((item) => {
      subtotal += item.product.price * item.quantity;
    });
  }
  return subtotal;
};
