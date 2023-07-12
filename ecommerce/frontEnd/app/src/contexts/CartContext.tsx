import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { cartController } from "services/apiController/cart";
import { useSuccessToast } from "hooks/toast/useSuccessToast";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  IProduct,
  IDataFetchCart,
} from "type/component";

interface ICartContext {
  cart: IDataFetchCart;
  addToCart: (product: IProduct) => void;
  getCart: () => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<IDataFetchCart | null>(null);
  const [addCart, setAddCart] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const navigate = useNavigate();

  const addToCart = useCallback(async (product: IProduct) => {
    const uqId = uuidv4();
    const result = await cartController().create(product);
    if (result?.status === 200) {
      const { message } = result;
      useSuccessToast(message);
      navigate("/cart");
      setAddCart(uqId);
    }
  }, []);

  const getCart = useCallback(async () => {
    const result = await cartController().get();
    if (result?.data) {
      const { data } = result;
      setCart(data);
    }
  }, [addCart]);

  useEffect(() => {
    getCart();
    return () => {};
  }, [getCart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, getCart, quantity, setQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): ICartContext => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;