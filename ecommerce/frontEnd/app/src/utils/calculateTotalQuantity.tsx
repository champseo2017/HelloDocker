import { IDataFetchCart } from "type/component";

export const calculateTotalQuantity = (cart: IDataFetchCart) => {
  let totalQuantity = 0;
  if (cart && cart.products?.length) {
    cart.products.forEach((item) => {
      totalQuantity += item.quantity;
    });
  }
  return totalQuantity;
};
