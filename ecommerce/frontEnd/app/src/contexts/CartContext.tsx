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
import { IProduct, IDataFetchCart } from "type/component";
import { timeout } from "utils/timeout";
import { useAuth } from "./AuthContext";

interface ICartContext {
  cart: IDataFetchCart;
  addToCart: (product: IProduct) => void;
  getCart: () => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  updateToCart: (product: IProduct) => void;
  deleteToCart: (id: string) => void;
  loadingCart: boolean;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, login, logout } = useAuth();
  const [cart, setCart] = useState<IDataFetchCart | null>(null);
  const [watchCart, setWatchCart] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);
  const navigate = useNavigate();

  const getCart = useCallback(async () => {
    if (user && user?.userId) {
      const result = await cartController().get();
      if (result?.data) {
        const { data } = result;
        setCart(data);
      }
    }
  }, [watchCart, user]);

  const addToCart = useCallback(async (product: IProduct) => {
    const uqId = uuidv4();
    const result = await cartController().create(product);
    if (result?.status === 200) {
      const { message } = result;
      useSuccessToast(message);
      navigate("/cart");
      setWatchCart(uqId);
    }
  }, []);

  const updateToCart = useCallback(async (product: IProduct) => {
    setLoadingCart(true);
    const uqId = uuidv4();
    const result = await cartController().update(product);
    setLoadingCart(false);
    if (result?.status === 200) {
      const { message } = result;
      useSuccessToast(message);
      setWatchCart(uqId);
    }
  }, []);

  const deleteToCart = useCallback(async (id: string) => {
    setLoadingCart(true);
    const uqId = uuidv4();
    const result = await cartController().delete(id);
    setLoadingCart(false);
    if (result?.status === 200) {
      const { message } = result;
      useSuccessToast(message);
      setWatchCart(uqId);
    }
  }, []);

  useEffect(() => {
    getCart();
    return () => {};
  }, [getCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        getCart,
        quantity,
        setQuantity,
        updateToCart,
        deleteToCart,
        loadingCart,
      }}
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
