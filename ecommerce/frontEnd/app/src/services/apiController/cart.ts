import { serviceToken, serviceNoneToken } from "../axiosProvider";
import { IResponse, ICartCreate } from "../typeApi";

export const cartController = () => {
  return {
    create: async (data: ICartCreate): Promise<IResponse> => {
      return (await serviceToken()).post(`/cart/create`, data);
    },
    update: async (data: {
      productId: string;
      quantity: number;
    }): Promise<IResponse> => {
      return (await serviceToken()).put(`/cart/update`, data);
    },
    get: async (): Promise<IResponse> => {
      return (await serviceToken()).get(`/cart`);
    },
    delete: async (id: string): Promise<IResponse> => {
      return (await serviceToken()).delete(`/cart/${id}`);
    },
  };
};
