import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://tasky-fullstack-quk3.onrender.com",
  //baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default axiosInstance;
