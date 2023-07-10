import axios from "axios";
// import createAuthRefreshInterceptor from "axios-auth-refresh";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = process.env.URL_DEV_API
axiosInstance.defaults.withCredentials = true;
// // Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// const refreshToken = (failedRequest) => {
//   const token = localStorage.getItem("token");
//   return axios
//     .put(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/refresh/token`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     )
//     .then((res) => {
//       console.log("res", res);
//       return Promise.resolve();
//     })
//     .catch((err) => {
//       localStorage.removeItem("token");
//       window.location.reload();
//       return Promise.reject();
//     });
// };

// createAuthRefreshInterceptor(axiosInstance, refreshToken);

export default axiosInstance;