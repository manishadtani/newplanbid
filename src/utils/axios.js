import axios from "axios";

const devBaseURL = import.meta.env.VITE_BASE_URL;
const prodBaseURL = import.meta.env.VITE_PROD_URL;

const baseURL = import.meta.env.PROD ? prodBaseURL : devBaseURL;


const token = localStorage.getItem("access_token");
const instance = axios.create({
  baseURL: baseURL,
  headers: {  
    "Content-Type": "multipart/form-data",
    "Authorization": `Bearer ${token}`,
  },
});

instance.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/auth/signup/",
      "/auth/login/",
      "/auth/verify-otp/",
      "/auth/resend-otp/",
      "/auth/states/",
    ];

    const isPublic = publicEndpoints.some(
      (endpoint) => config.url && config.url.includes(endpoint)
    );

    const token = localStorage.getItem("access_token");

    if (!isPublic && token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Ensure token is not sent for public routes
      delete config.headers["Authorization"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
