import PageTitle from "components/client/PageTitle";
import CartTable from "components/client/CartTable";
import BackToProductButton from "components/client/BackToProductButton";

const CartPage = () => {
  return (
    <div className="container min-h-screen mx-auto mb-20">
      <PageTitle text="Your Cart" />
      <CartTable />
      <div className="max-w-sm px-2 mx-auto space-y-4">
        <BackToProductButton />
      </div>
    </div>
  );
};

export default CartPage;
