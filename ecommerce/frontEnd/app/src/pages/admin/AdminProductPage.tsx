import ContainerProductPage from "container/ContainerProductPage";
import ModalProvider from "contexts/ModalContext";

const AdminProductPage = () => {
  return (
    <ModalProvider>
      <ContainerProductPage />
    </ModalProvider>
  );
};

export default AdminProductPage;
