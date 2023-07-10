import { serviceToken } from "../axiosProvider";
import { IProduct, IResponse } from "../typeApi";
import { configHeader } from "../configHeader";

export const productController = () => {

  const objHeader = {
    ...configHeader.uploadFile,
  };

  return {
    addProduct: async (data: IProduct): Promise<IResponse> => {
      const formData = data;
      return (await serviceToken()).post(
        `/product/add`,
        formData,
        objHeader
      );
    },
  };
};
