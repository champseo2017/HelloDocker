import { serviceToken } from "../axiosProvider";
import { IResponse } from "../typeApi";
import { configHeader } from "../configHeader";

export const productController = () => {

  const objHeader = {
    ...configHeader.uploadFile,
  };

  return {
    addProduct: async (data: FormData): Promise<IResponse> => {
      const formData = data;
      return (await serviceToken()).post(
        `/product/add`,
        formData,
        objHeader
      );
    },
  };
};
