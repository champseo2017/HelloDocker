import axios from "axios";
import axiosInstance from "./axiosInstance";
import { useErrorToast } from "hooks/toast/useErrorToast";
import { storeTokenIfPresent } from "utils/storeTokenIfPresent";

const BASE_API = process.env.REACT_APP_DEV_API;

const responseSuccess = (res: any) => {
  const { data } = res;
  return { ...data };
};

const responseError = (error: any) => {
  const { response, message } = error;
  if (error) {
    const { status, message: msgeRes } = response?.data;
    if (status >= 400) {
      useErrorToast(msgeRes);
      return {
        status: status,
        data: null,
        message: msgeRes,
      };
    }
  }
  useErrorToast(message);
  return {
    status: 500,
    data: null,
    message: "No data",
  };
};

const axiosService = (
  type: string,
  url: string,
  params: any,
  headers: any,
  token: string
): Promise<{
  status: number;
  data: any;
  message: string;
}> => {
  const axiosWithToken = token ? axiosInstance : axios;
  switch (type) {
    case "get": {
      return axiosWithToken
        .get(`${BASE_API}${url}`, { params })
        .then((res) => {
          const result = responseSuccess(res);
          return result;
        })
        .catch((error) => {
          const result = responseError(error);
          return result;
        });
    }
    case "post": {
      return axiosWithToken
        .post(`${BASE_API}${url}`, params, headers)
        .then((res) => {
          const result = responseSuccess(res);
          storeTokenIfPresent(result);
          return result;
        })
        .catch((error) => {
          const result = responseError(error);
          return result;
        });
    }
    case "put": {
      return axiosWithToken
        .put(`${BASE_API}${url}`, params, headers)
        .then((res) => {
          const result = responseSuccess(res);
          storeTokenIfPresent(result);
          return result;
        })
        .catch((error) => {
          const result = responseError(error);
          return result;
        });
    }
    case "delete": {
      return axiosWithToken
        .delete(`${BASE_API}${url}`, params)
        .then((res) => {
          const result = responseSuccess(res);
          storeTokenIfPresent(result);
          return result;
        })
        .catch((error) => {
          const result = responseError(error);
          return result;
        });
    }
    default: {
      return Promise.resolve({
        status: 500,
        data: null,
        message: "No data",
      });
    }
  }
};
export default (token = "") => {
  return {
    get: (url: string, params?: any, headers: any = {}) =>
      axiosService("get", url, params, headers, token),
    post: (url: string, params: any, headers: any = {}) =>
      axiosService("post", url, params, headers, token),
    put: (url: string, params: any, headers: any = {}) =>
      axiosService("put", url, params, headers, token),
    delete: (url: string, params: any, headers: any = {}) =>
      axiosService("delete", url, params, headers, token),
  };
};
