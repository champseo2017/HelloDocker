import { IDataFetchCart } from "type/component";

export const calculateTotalQuantity = (cart: IDataFetchCart) => {
  let totalQuantity = 0;
  if (cart && cart.products?.length) {
    totalQuantity = cart.products.length;
  }
  return totalQuantity;
};
