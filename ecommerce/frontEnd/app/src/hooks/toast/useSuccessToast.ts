import { toast } from "react-hot-toast";

export const useSuccessToast = (message: string, duration = 3000) => {
  return toast.success(message, { duration });
};
