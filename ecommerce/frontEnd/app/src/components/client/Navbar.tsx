import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="border-b border-palette-lighter sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between mx-auto max-w-6xl px-6 pb-2 pt-4 md:pt-6">
        <Link to="/" className=" cursor-pointer">
          <h1 className="flex no-underline">
            <img
              height="32"
              width="32"
              alt="logo"
              className="h-8 w-8 mr-1 object-contain"
              src="/image/energy-drink.png"
            />
            <span className="text-xl font-primary font-bold tracking-tight pt-1">
              {process.env.siteTitle}
            </span>
          </h1>
        </Link>
        <div>
          <Link to="/cart" className=" relative" aria-label="cart">
            {/* @ts-ignore */}
            <FontAwesomeIcon
              className="text-palette-primary w-6 m-auto"
              // @ts-ignore
              icon={faShoppingCart}
            />
            {/* {
                cartItems === 0 ?
                  null
                  :
                  <div
                    className="absolute top-0 right-0 text-xs bg-yellow-300 text-gray-900 font-semibold rounded-full py-1 px-2 transform translate-x-10 -translate-y-3"
                  >
                    {cartItems}
                  </div>
              } */}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
