import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 8000,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response && error.response.status === 403) {
      window.location.href = "/logout";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
