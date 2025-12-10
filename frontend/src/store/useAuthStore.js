import { create } from "zustand";
import { axiosInstance } from "../lib/axois";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  socketInitialized: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      console.log("res", res.data);

      set({ authUser: res.data });
      // connect socket after we have authUser
      get().connectSocket();
    } catch (error) {
      console.log(
        "Error in AuthCheck :",
        error.response?.data?.message || error.message
      );
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      get().connectSocket();
      toast.success("User registered successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      get().connectSocket();
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("auth/logout");
      // disconnect socket and clear auth
      get().disconnectSocket();
      set({ authUser: null, onlineUsers: [] });
      toast.success("Logout Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.log("Error in logout ", error);
    }
  },
  updateProfile: async (data) => {
    try {
      // If data is FormData, axios will set proper headers automatically.
      const res = await axiosInstance.put("/auth/update-profile", data);
      // backend returns { message, user }
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile: ", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  },
  connectSocket: () => {
    const { authUser, socketInitialized, socket } = get();
    if (!authUser || socketInitialized) return;

    // derive socket base URL from axiosInstance (remove trailing /api if present)
    const base = axiosInstance.defaults.baseURL || '';
    const BASE_URL = base.replace(/\/api\/?$/, '') || window.location.origin;
    console.log("socket BASE_URL:", BASE_URL);

    // ensure any previous socket is cleaned up
    if (socket) {
      try {
        socket.removeAllListeners();
        if (socket.connected) socket.disconnect();
      } catch (e) {
        console.warn('Error cleaning previous socket', e);
      }
    }

    const newSocket = io(BASE_URL, {
      withCredentials: true,
    });

    // mark initialized to avoid duplicate connects
    set({ socketInitialized: true, socket: newSocket });

    // attach listeners
    newSocket.on("connect", () => {
      console.log("socket connected", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("socket disconnected", reason);
      // allow reconnect attempts to reinitialize
      set({ socketInitialized: false, socket: null, onlineUsers: [] });
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));    
