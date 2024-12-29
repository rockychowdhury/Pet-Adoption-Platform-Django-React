import axios from "axios";
import useUIContext from "./useUIContext";
import { useEffect } from "react";
import { API } from "../utils/baseURL";
import useAuth from './useAuth';

const axiosInstance = axios.create({
    baseURL: API,
    withCredentials: true,
});




const useAxiosSecure = () => {
    const { showToast } = useUIContext();
    const { token, setToken, logout } = useAuth();
// const token = null
console.log(token,"here");
    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                if (token)
                    config.headers['Authorization'] = `Bearer ${token}`;
                console.log("from here");
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) =>{
                console.log(response);
                return response; 
            },
            (error)=>{
                console.log(error);
                return Promise.reject(error);
            }
        );

        return ()=>{
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };


    }, [token])

    return axiosInstance
};

export default useAxiosSecure;