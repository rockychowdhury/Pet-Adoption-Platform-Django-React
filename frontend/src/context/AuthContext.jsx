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
                toast.success("Registration successful! Please verify your email.");
                // No auto-login, wait for verification
                return response.data;
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Registration failed. Please try again.");
            setError(err.response?.data?.detail || "Registration failed.");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const verifyEmail = async (email, code) => {
        setLoading(true);
        try {
            const response = await api.post('/user/verify-email/', { email, code });
            if (response.status === 200) {
                toast.success("Email verified successfully!");
                await getUser(); // Fetch user as cookies are set
                return true;
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Verification failed.");
            throw err;
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

    const requestPasswordReset = async (email) => {
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
    }

    const confirmPasswordReset = async (uidb64, token, password) => {
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
    }

    const resendEmailVerification = async (email) => {
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
    }

    const authInfo = {
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
    };
    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
    children: PropTypes.any,
}

export default AuthProvider;