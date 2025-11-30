import {create} from "zustand"
import {axiosInstance} from "../lib/axois"
import toast from "react-hot-toast"

export const useAuthStore = create((set,get)=>({

    authUser : null,
    isCheckingAuth : true,
    isSigningUp: false,
    isLoggingIn:false,
    

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            console.log("res",res.data);
            
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in AuthCheck :", error.response.data.message);
            set({authUser: null})
        }finally{
            set({isCheckingAuth:false})
        }
    },
    signUp: async(data)=>{
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data.user})
            toast.success("User registered successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed")
        }finally{
            set({isSigningUp:false})
        }
    },
    login: async(data)=>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data.user})
            toast.success("Login successful")
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed")
        }finally{
            set({isLoggingIn:false})
        }
    },

    logout: async()=>{
        try {
            const res = await axiosInstance.post("auth/logout")
            set({authUser:null})
            toast.success("Logout Successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed")
            console.log("Error in logout ",error);
            
        }
    }
}))