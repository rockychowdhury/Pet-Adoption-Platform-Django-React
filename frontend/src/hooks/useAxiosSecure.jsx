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
    const { logout } = useAuth();

    useEffect(() => {
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    await logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [logout]);

    return axiosInstance;
};

export default useAxiosSecure;