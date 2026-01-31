import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./Contexts";
import PropTypes from "prop-types";
import useAPI from "../hooks/useAPI";



import { authObserver } from "../utils/AuthObserver";
import { extractErrorMessage } from "../utils/errorUtils";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const api = useAPI();

    // Listen for global auth failures (e.g. refresh failed)
    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
        };
        authObserver.subscribe(handleLogout);
        return () => authObserver.unsubscribe(handleLogout);
    }, []);

    const getUser = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/user/');
            if (response.status === 200) {
                setUser(response.data);
                return response.data;
            }
        } catch (error) {
            // detailed logging for debugging
            console.log("Failed to fetch user:", error);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [api]);

    // Restore session on mount
    useEffect(() => {
        const initializeAuth = async () => {
            await getUser();
        };
        initializeAuth();
    }, [getUser]);

    const register = React.useCallback(async (data) => {
        setLoading(true);
        try {
            const response = await api.post('/user/register/', data);
            if (response.status === 201) {
                toast.success("Registration successful! Please verify your email.");
                return response.data;
            }
        } catch (err) {
            console.error(err);
            const msg = extractErrorMessage(err, "Registration failed.");
            toast.error(msg);
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

    const verifyEmail = React.useCallback(async (email, code) => {
        setLoading(true);
        try {
            const response = await api.post('/user/verify-email/', { email, code });
            if (response.status === 200) {
                toast.success("Email verified successfully!");
                await getUser();
                return true;
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Verification failed.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api, getUser]);

    const login = React.useCallback(async (credentials) => {
        setLoading(true);
        try {
            const response = await api.post('/user/token/', credentials);
            if (response.status === 200) {
                toast.success("Welcome back!");
                return await getUser();
            }
        } catch (err) {
            setLoading(false);
            setUser(null);
            console.log(err);
            const errorMessage = err.response?.data?.detail || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
            setError(errorMessage);
            throw err;
        }
    }, [api, getUser]);

    const logout = React.useCallback(async () => {
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
    }, [api]);

    const requestPasswordReset = React.useCallback(async (email) => {
        setLoading(true);
        try {
            await api.post('/user/request-password-reset/', { email });
            toast.success("Password reset link sent to your email.");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Failed to send reset link.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

    const confirmPasswordReset = React.useCallback(async (uidb64, token, password) => {
        setLoading(true);
        try {
            await api.patch('/user/password-reset-confirm/', { uidb64, token, password });
            toast.success("Password reset successfully! Please login.");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to reset password.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

    const resendEmailVerification = React.useCallback(async (email) => {
        setLoading(true);
        try {
            const response = await api.post('/user/resend-email-verification/', { email });
            toast.success("Verification code sent! Please check your email.");
            return response.data;
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || 'Failed to resend code';
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

    const authInfo = React.useMemo(() => ({
        user, setUser,
        loading, setLoading,
        register,
        verifyEmail,
        login,
        getUser,
        logout,
        requestPasswordReset,
        confirmPasswordReset,
        resendEmailVerification,
        error, setError
    }), [user, loading, error, register, verifyEmail, login, getUser, logout, requestPasswordReset, confirmPasswordReset, resendEmailVerification]);

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
    children: PropTypes.any,
}

export default AuthProvider;