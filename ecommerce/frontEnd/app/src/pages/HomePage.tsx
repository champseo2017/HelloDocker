import LoginForm from "components/form/LoginForm";
import AddProductForm from "components/form/AddProductForm";
import ProductTable from "components/table";

const HomePage = () => {
  return (
    <>
      {/* <LoginForm /> */}
      <AddProductForm />
      <ProductTable />
    </>
  );
};

export default HomePage;
