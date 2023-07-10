import { toast } from "react-hot-toast";

export const useErrorToast = (message: string, duration = 3000) => {
  return toast.error(message, { duration });
};
