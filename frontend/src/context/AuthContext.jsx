import { useEffect, useLayoutEffect, useState } from "react";
import { AuthContext } from "./Contexts";
import PropTypes from "prop-types";
import useAPI from "../hooks/useAPI";



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const api = useAPI();


    const register = async (data) => {
        setLoading(true);
        const response = await api.post('/user/register/', data);
        if (response.status === 201) {
            const { email, password } = data;
            login({ email, password });
        }
    }

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await api.post('/user/token/', credentials);
            if (response.status === 200) {
                setToken(response.data.access);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setUser(null);
            setToken(null);
            console.log(err);
        }
        return
    }

    const getUser = async () => {
        setLoading(true);
        const response = await api.get('/user/');
        if (response.status === 200) {
            setUser(response.data);
            setLoading(false);
        }
    }
    const logout = async () => {
        const res = await api.post('/user/logout/');
        if (res.status === 200) {
            setToken(null);
            setUser(null);
            setLoading(false);
        }
    }
    const refreshToken = () => {
        setLoading(true);
        return api.post('/user/token/refresh/');
    }

    useEffect(() => {
        setLoading(true);
        const loadUser = async () => {
            try {
                await getUser();
                setLoading(false);
            } catch {
                setUser(null);
            }
        };
        loadUser();
    }, [token]);


    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use(
            (config) => {
                config.headers.Authorization =
                    !config._retry && token
                        ? `Bearer ${token}`
                        : config.headers.Authorization;
                return config;
            });
        return () => {
            api.interceptors.request.eject(authInterceptor);
        };
    }, [token])



    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                console.log(error);
                console.log(error.status);
                console.log(originalRequest);
                if (error.status === 401 && originalRequest.url !== "/user/token/refresh/") {
                    console.log("pakar liya tuje jane nehi dungaa");
                    try {
                        console.log("inside try");
                        const response = await refreshToken();
                        setToken(response.data.access);
                        if(originalRequest.url==='/user/'){
                            return Promise.reject(response);
                        }
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        originalRequest._retry = true;
                        return api(originalRequest);
                    }
                    catch (error) {
                        setUser(null);
                        setToken(null);
                        setLoading(false);
                        console.log("inside catch", error);
                        return Promise.reject(error)
                    }
                }
                    console.log("rejecting");
                    return Promise.reject(error);
            },
        );
        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        }
    }, [])

// logout()
    console.log(loading, user);
    const authInfo = {
        user, setUser,
        loading, setLoading,
        register,
        login,
        getUser,
        logout,
        refreshToken,
        token, setToken,
        error, setError
    };
    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
    children: PropTypes.any,
}

export default AuthProvider;