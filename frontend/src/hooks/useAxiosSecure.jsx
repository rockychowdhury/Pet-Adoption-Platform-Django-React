import axios from "axios";
import { useEffect } from "react";
import { API } from "../utils/baseURL";
import useAuth from './useAuth';

// Dedicated secure instance (same base config as useAPI)
const axiosInstance = axios.create({
    baseURL: API,
    withCredentials: true,
});

let refreshPromise = null;
const refreshAccessToken = async () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${API}/user/token/refresh/`, {}, { withCredentials: true })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

const useAxiosSecure = () => {
    const { logout } = useAuth();

    useEffect(() => {
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const status = error.response?.status;

                if ((status === 401 || status === 403) && !originalRequest?._retry) {
                    originalRequest._retry = true;
                    try {
                        await refreshAccessToken();
                        return axiosInstance(originalRequest);
                    } catch (refreshErr) {
                    await logout();
                        return Promise.reject(refreshErr);
                    }
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