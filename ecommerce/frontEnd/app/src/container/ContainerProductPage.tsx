import { memo } from "react";
import ProductTable from "components/table";
import AddProductModal from "components/modal/AddProductModal";
import { Button } from "flowbite-react";
import { useModal } from "contexts/ModalContext";

const ContainerProductPage = () => {
  const { openModal, isModalOpen, closeModal } = useModal();
  return <div className="mx-auto max-w-6xl flex flex-col">
  <div className="flex items-center justify-end my-2">
    <Button color="success" onClick={openModal} className="shadow">
      Add Product
    </Button>
  </div>
  <ProductTable />
  {isModalOpen && (
    <AddProductModal isOpen={isModalOpen} onClose={closeModal} />
  )}
</div>;
};

export default memo(ContainerProductPage);
