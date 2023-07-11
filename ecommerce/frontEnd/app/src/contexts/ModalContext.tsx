import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// สร้าง Contexts เพื่อเก็บสถานะการแสดง Modal
export const ModalContext = createContext<{
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}>({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

// สร้าง Provider เพื่อใช้ในการแชร์ Contexts
const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

export default ModalProvider;
