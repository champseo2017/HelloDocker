import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface IProduct {
  productId: string;
  quantity: number;
}

interface IImagePath {
  position: number;
  url: string;
}

interface IProductData {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  imagePaths: IImagePath[];
  createdAt: string;
  updatedAt: string;
}

interface ICartProduct {
  product: IProductData;
  quantity: number;
}

interface IDataFetchCart {
  _id: string;
  products: ICartProduct[];
  createdAt: string;
  updatedAt: string;
}

interface ICartContext {
  cart: IDataFetchCart;
  addToCart: (product: IProduct) => void;
  getCart: () => void;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<IDataFetchCart | null>(null);

  const addToCart = useCallback(async (product: IProduct) => {
    console.log("product", product)
  }, []);

  const getCart = () => {
    // Code to get cart data.
    // You can use an API request here.
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, getCart }}>
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
