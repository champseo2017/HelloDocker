import { useMemo, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ContainerUseSignIn from "container/ContainerUseSignIn";
import { calculateTotalQuantity } from "utils/calculateTotalQuantity";
import { useCart } from "contexts/CartContext";
import { useAuth } from "contexts/AuthContext";

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const {
    cart,
    addToCart,
    getCart,
    quantity: useQuantity,
    setQuantity: useSetQuantity,
  } = useCart();

  const resultQuantity = useMemo(() => {
    const res = calculateTotalQuantity(cart);
    return res;
  }, [cart]);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-palette-lighter">
      <div className="flex items-center justify-between max-w-6xl px-6 py-4 mx-auto">
        <Link to="/" className="cursor-pointer ">
          <h1 className="flex no-underline">
            <img
              height="32"
              width="32"
              alt="logo"
              className="object-contain w-8 h-8 mr-1"
              src="/image/energy-drink.png"
            />
            <span className="pt-1 text-xl font-bold tracking-tight font-primary">
              If you want to be fresh
            </span>
          </h1>
        </Link>
        <div className="flex items-center justify-center gap-4 ">
          <div>
            <Link to="/cart" className="relative " aria-label="cart">
              {/* @ts-ignore */}
              <FontAwesomeIcon
                className="w-6 m-auto text-palette-primary"
                // @ts-ignore
                icon={faShoppingCart}
              />

              {resultQuantity === 0 ? null : (
                <div className="absolute top-0 right-[2rem] px-2 py-1 text-xs font-semibold text-gray-900 transform translate-x-10 -translate-y-3 bg-yellow-300 rounded-full">
                  {resultQuantity}
                </div>
              )}
            </Link>
          </div>
          <ContainerUseSignIn />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
