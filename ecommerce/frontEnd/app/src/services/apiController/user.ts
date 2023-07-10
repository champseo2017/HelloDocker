import { serviceToken } from "../axiosProvider";
import { ILogin, IResponse } from "../typeApi";

export const userController = () => {
  return {
    login: async (data: ILogin): Promise<IResponse> => {
      const formData = data;
      return (await serviceToken()).post(`/user/login`, formData);
    },
  };
};
