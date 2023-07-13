import { useState, useEffect, useCallback, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "contexts/AuthContext";
import LoginModalCart from "components/modal/LoginModalCart";
import { useCart } from "contexts/CartContext";
import { redirect, useNavigate, useParams } from "react-router-dom";

interface IProductForm {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}
const ProductForm = (props: IProductForm) => {
  const {
    cart,
    addToCart,
    getCart,
    quantity: useQuantity,
    setQuantity: useSetQuantity,
  } = useCart();
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const { user, login, logout } = useAuth();
  const { _id, name, price, quantity: productQuantity, description } = props;
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(null);

  const updateQuantity = useCallback((e) => {
    if (e === "") {
      useSetQuantity(0);
    } else {
      useSetQuantity(Math.floor(e));
    }
  }, []);

  useEffect(() => {
    useSetQuantity(1)
    return () => {}
  }, [])
  

  const funcCheckAuth = useCallback(async () => {
    if (user && user.role) {
      setIsModalOpen(false);
    }
  }, [user]);

  useEffect(() => {
    funcCheckAuth();
    return () => {};
  }, [funcCheckAuth]);

  const handleAddToCart = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const dataCart = {
        productId: id,
        quantity: useQuantity,
      };
      e.preventDefault();
      if (user && user.userId) {
        addToCart(dataCart);
      } else {
        setIsModalOpen(true);
      }
    },
    [user, useQuantity, id]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-start w-full space-x-2">
        <div className="flex flex-col items-start flex-grow-0 space-y-1">
          <label className="text-base text-gray-500">Qty.</label>
          <input
            type="number"
            inputMode="numeric"
            id="quantity"
            name="quantity"
            min="1"
            step="1"
            value={useQuantity}
            onChange={(e) => updateQuantity(e.target.value)}
            className="w-16 text-gray-900 border border-gray-300 rounded-sm form-input focus:border-palette-light focus:ring-palette-light"
          />
        </div>
        <p className=" text-lg text-black">Number of items: {productQuantity}</p>
      </div>
      <button
        className={
          "pt-3 pb-2 bg-palette-primary text-white w-full mt-2 rounded-sm font-primary font-semibold text-xl flex justify-center items-baseline  hover:bg-palette-dark"
        }
        aria-label="cart-button"
        onClick={handleAddToCart}
      >
        Add To Cart
        {/* @ts-ignore */}
        <FontAwesomeIcon icon={faShoppingCart} className="w-5 ml-2" />
      </button>
      {isModalOpen && (
        <LoginModalCart isOpen={isModalOpen} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default ProductForm;
