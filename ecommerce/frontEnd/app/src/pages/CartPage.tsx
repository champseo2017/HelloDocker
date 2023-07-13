import { useEffect } from "react";
import PageTitle from "components/client/PageTitle";
import CartTable from "components/client/CartTable";
import BackToProductButton from "components/client/BackToProductButton";
import Loading from "components/loading";
import { useCart } from "contexts/CartContext";
import { useAuth } from "contexts/AuthContext";

const CartPage = () => {
  const { user, login, logout } = useAuth();
  const {
    cart,
    addToCart,
    getCart,
    quantity: useQuantity,
    setQuantity: useSetQuantity,
    loadingCart
  } = useCart();

  // useEffect(() => {
  //   if (user && user?.userId) {
  //     getCart();
  //   }
  //   return () => {};
  // }, [user]);

  return (
    <div className="container min-h-screen mx-auto mb-20">
      {loadingCart && <Loading/>}
      <PageTitle text="Your Cart" />
      <CartTable />
      <div className="max-w-sm px-2 mx-auto space-y-4">
        <BackToProductButton />
      </div>
    </div>
  );
};

export default CartPage;
