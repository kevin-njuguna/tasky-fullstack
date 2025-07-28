import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://tasky-fullstack-quk3.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
