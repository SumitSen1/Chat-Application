import axios from "axios"

//FROM COPILOT

// Allow overriding API URL via Vite env `VITE_API_URL`, otherwise fall back to localhost in dev
const resolvedBaseURL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api");

export const axiosInstance = axios.create({
    baseURL: resolvedBaseURL,
    withCredentials:true,
})

// Debug: expose/print baseURL so it's easy to spot incorrect resolves in browser console
console.log("axios baseURL:", axiosInstance.defaults.baseURL);


//original

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
//   withCredentials: true,
// }); 