import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthSplitLayout from '../../layouts/AuthSplitLayout';
import FeatureCarousel from '../../components/Auth/FeatureCarousel';
import AuthForm from '../../components/Auth/AuthForm';
import useAuth from '../../hooks/useAuth';
import { getRoleBasedRedirect } from '../../utils/roleRedirect';

const LoginPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Redirect if already logged in - role-based
    useEffect(() => {
        if (user) {
            const redirectPath = getRoleBasedRedirect(user);
            navigate(redirectPath, { replace: true });
        }
    }, [user, navigate]);

    const handleLoginSuccess = (userData) => {
        // Handle both "user object" or "options object" if inconsistent, but here we expect user object or null
        if (userData?.preventRedirect) return;

        // Use fresh user data if provided, otherwise fallback to context (which might be stale)
        const currentUser = userData || user;
        const redirectPath = getRoleBasedRedirect(currentUser);

        console.log("Login Success. Redirecting to:", redirectPath, "User:", currentUser);
        navigate(redirectPath, { replace: true });
    };

    return (
        <AuthSplitLayout carousel={<FeatureCarousel />}>
            <div className="w-full max-w-md mx-auto py-8">
                <AuthForm
                    initialMode="login"
                    onSuccess={handleLoginSuccess}
                />
            </div>
        </AuthSplitLayout>
    );
};

export default LoginPage;
