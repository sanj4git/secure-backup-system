import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Attach JWT automatically
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔥 Global error handler
API.interceptors.response.use(

  (response) => response,

  (error) => {

    // If token invalid or expired
    if (error.response && error.response.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      window.location.href = "/";
    }

    return Promise.reject(error);

  }

);

export default API;