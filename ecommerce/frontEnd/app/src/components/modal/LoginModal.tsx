import AddProductForm from "components/form/AddProductForm";
import { Transition } from "react-transition-group";
import { MouseEvent } from "react";
import { MdClose } from "react-icons/md";
import LoginFormModal from "components/form/LoginFormModal";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const AddProductModal = ({ isOpen, onClose }: LoginModalProps) => {
  return (
    <Transition in={isOpen} timeout={200}>
      {(state) => (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          style={{ ...transitionStyles[state] }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={onClose}
            ></div>

            <div className="inline-block my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl sm:align-middle sm:max-w-[45rem] sm:w-full">
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-6 h-6 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none"
                  onClick={onClose}
                >
                  <MdClose size={20} />
                </button>
              </div>
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="justify-center sm:flex sm:items-start">
                  <div className="my-2">
                    <LoginFormModal />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default AddProductModal;
