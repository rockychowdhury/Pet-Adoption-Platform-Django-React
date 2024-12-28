import { useEffect, useState } from "react";
import { AuthContext } from "./Contexts";
import PropTypes from "prop-types";
import api from "../utils/api";
import { setData } from "../utils/localstorage";
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    const register = async (data) => {
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
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            if (response.status === 200) {
                const res = await getUser();
                setUser(res.data);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
        return
    }
    const getUser = () => {
        setLoading(true);
        return api.get('/user/');
    }
    const logout = async () => {
        const res = await api.post('/user/logout/', { refresh: localStorage.getItem('refresh') });
        if (res.status === 200) {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            setUser();
            setLoading(false);
        }
    }
    const refreshToken = async () => {
        const res = await api.post('/user/token/refresh/', { refresh: localStorage.getItem('refresh') });
        console.log(res);
        setData(res.data);
    }
    useEffect(() => {
        setLoading(true);
        const loadUser = async () => {
            const res = await getUser();
            console.log(res);
            if (res.status === 401) {
                console.log('here');
                refreshToken();
            }
            if (res.status === 200) {
                setUser(res.data);
                setLoading(false);
            }
        }
        loadUser();
    }, []);
    // console.log(user);
    console.log(loading, user);
    const authInfo = {
        user,
        setUser,
        loading,
        setLoading,
        register,
        login,
        getUser,
        logout,
        refreshToken,
    };
    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
    children: PropTypes.any,
}

export default AuthProvider;