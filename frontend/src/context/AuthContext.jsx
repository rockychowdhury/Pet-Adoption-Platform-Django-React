import { useEffect, useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./Contexts";
import PropTypes from "prop-types";
import useAPI from "../hooks/useAPI";



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const api = useAPI();

    const register = async (data) => {
        setLoading(true);
        try {
            const response = await api.post('/user/register/', data);
            if (response.status === 201) {
                toast.success("Registration successful! Logging you in...");
                const { email, password } = data;
                await login({ email, password });
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Registration failed. Please try again.");
            setError(err.response?.data?.detail || "Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await api.post('/user/token/', credentials);
            if (response.status === 200) {
                toast.success("Welcome back!");
                await getUser(); // Fetch user details after successful login
            }
        } catch (err) {
            setLoading(false);
            setUser(null);
            console.log(err);
            const errorMessage = err.response?.data?.detail || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
            setError(errorMessage);
        }
    }

    const getUser = async () => {
        setLoading(true);
        try {
            const response = await api.get('/user/');
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        try {
            const res = await api.post('/user/logout/');
            if (res.status === 200) {
                setUser(null);
                toast.info("Logged out successfully.");
            }
        } catch (err) {
            console.error(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    const refreshToken = () => {
        return api.post('/user/token/refresh/');
    }

    useEffect(() => {
        getUser();
    }, []);

    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && originalRequest.url !== "/user/token/refresh/") {
                    try {
                        await refreshToken();
                        // Retry the original request; cookies will be sent automatically
                        return api(originalRequest);
                    } catch (refreshError) {
                        setUser(null);
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            },
        );
        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        }
    }, [])

    const authInfo = {
        user, setUser,
        loading, setLoading,
        register,
        login,
        getUser,
        logout,
        error, setError
    };
    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
    children: PropTypes.any,
}

export default AuthProvider;