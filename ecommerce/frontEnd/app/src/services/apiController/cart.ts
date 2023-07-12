import { serviceToken, serviceNoneToken } from "../axiosProvider";
import { IResponse, ICartCreate } from "../typeApi";

export const cartController = () => {
  return {
    create: async (data: ICartCreate): Promise<IResponse> => {
      const formData = data;
      return (await serviceToken()).post(`/cart/create`, formData);
    },
    // update: async (data: FormData): Promise<IResponse> => {
    //   const formData = data;
    //   return (await serviceToken()).put(`/product/update`, formData, objHeader);
    // },
    get: async (): Promise<IResponse> => {
      return (await serviceToken()).get(`/cart`);
    },
    // getById: async (id: string): Promise<IResponse> => {
    //   return (await serviceNoneToken()).get(`/product/${id}`);
    // },
    // delete: async (id: string): Promise<IResponse> => {
    //   return (await serviceToken()).delete(`/product/delete/${id}`);
    // },
  };
};
