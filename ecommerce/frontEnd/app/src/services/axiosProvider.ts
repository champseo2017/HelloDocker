import apiService from "./apiService";
import { timeout } from "utils/timeout";

interface IService {
  get: (url: string, params?: any, headers?: any) => any;
  post: (url: string, params?: any, headers?: any) => any;
  put: (url: string, params?: any, headers?: any) => any;
  delete: (url: string, params?: any, headers?: any) => any;
}

const defaultResponse = {
  status: 500,
  data: null,
  message: "",
};

const tokenTimeout = async () => {
  await timeout(750);
  return localStorage.getItem("token");
};

const serviceToken = async (): Promise<IService> => {
  const resToken = await tokenTimeout();
  return apiService(resToken);
};

const serviceNoneToken = async (): Promise<IService> => {
  return apiService();
};

export { serviceToken, serviceNoneToken, tokenTimeout, defaultResponse };
