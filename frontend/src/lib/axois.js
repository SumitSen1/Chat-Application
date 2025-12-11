import axios from "axios"

// Determine baseURL based on environment:
// - In development: use http://localhost:3001/api (local backend)
// - In production: use VITE_API_URL or default to /api (relative, assumes same origin)
const baseURL = import.meta.env.VITE_API_URL || 
    (import.meta.env.MODE === "development" 
        ? "http://localhost:3001/api" 
        : "/api");

export const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
})

// Debug: expose/print baseURL so it's easy to spot incorrect resolves in browser console
console.log("axios baseURL:", axiosInstance.defaults.baseURL);


//original

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
//   withCredentials: true,
// }); 