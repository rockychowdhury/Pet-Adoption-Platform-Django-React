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

    const handleLoginSuccess = () => {
        // Get fresh user from context after login
        const redirectPath = getRoleBasedRedirect(user);
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
