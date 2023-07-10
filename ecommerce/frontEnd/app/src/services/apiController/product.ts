import { serviceToken, serviceNoneToken } from "../axiosProvider";
import { IResponse, IProductGet } from "../typeApi";
import { configHeader } from "../configHeader";

export const productController = () => {
  const objHeader = {
    ...configHeader.uploadFile,
  };

  return {
    add: async (data: FormData): Promise<IResponse> => {
      const formData = data;
      return (await serviceToken()).post(`/product/add`, formData, objHeader);
    },
    update: async (data: FormData): Promise<IResponse> => {
      const formData = data;
      return (await serviceToken()).put(`/product/update`, formData, objHeader);
    },
    get: async ({ page, sort, limit }: IProductGet): Promise<IResponse> => {
      return (await serviceNoneToken()).get(
        `/product?page=${page}&sort=${sort}&limit=${limit}`
      );
    },
    getById: async (id: string): Promise<IResponse> => {
      return (await serviceNoneToken()).get(`/product/${id}`);
    },
    delete: async (id: string): Promise<IResponse> => {
      return (await serviceToken()).delete(`/product/delete/${id}`);
    },
  };
};
