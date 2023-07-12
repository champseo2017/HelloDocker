import { useState, useEffect, useCallback, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "contexts/AuthContext";
import LoginModal from "components/modal/LoginModal";
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
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const params = useParams();
  console.log("cart", cart);
  const { user, login, logout } = useAuth();
  const { _id, name, price, quantity: productQuantity, description } = props;
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateQuantity = useCallback((e) => {
    if (e === "") {
      setQuantity(0);
    } else {
      setQuantity(Math.floor(e));
    }
  }, []);

  const funcCheckAuth = useCallback(async () => {
    if (user && user.role) {
      setIsModalOpen(false);
    }
  }, [user]);

  useEffect(() => {
    funcCheckAuth();
    return () => {};
  }, [funcCheckAuth]);

  useEffect(() => {
    setQuantity(productQuantity);
    return () => {};
  }, [productQuantity]);

  const handleAddToCart = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const { id } = params;

      const dataCart = {
        productId: id,
        quantity: quantity,
      };
      e.preventDefault();
      if (user && user.userId) {
        // navigate("/login");
        console.log("quantity", quantity);
        console.log("id", id);
      } else {
        setIsModalOpen(true);
        if (!isModalOpen) {
          addToCart(dataCart);
        }
      }
    },
    [user, quantity, cart, isModalOpen]
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
            value={quantity}
            onChange={(e) => updateQuantity(e.target.value)}
            className="w-16 text-gray-900 border border-gray-300 rounded-sm form-input focus:border-palette-light focus:ring-palette-light"
          />
        </div>
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
        <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default ProductForm;
