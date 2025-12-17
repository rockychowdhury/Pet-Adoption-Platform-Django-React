import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthSplitLayout from '../../layouts/AuthSplitLayout';
import FeatureCarousel from '../../components/Auth/FeatureCarousel';
import AuthForm from '../../components/Auth/AuthForm';
import useAuth from '../../hooks/useAuth';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <AuthSplitLayout carousel={<FeatureCarousel />}>
            <div className="w-full max-w-md mx-auto py-8">
                <AuthForm
                    initialMode="register"
                    onSuccess={() => { }} // AuthForm handles navigation to verify-email
                />
            </div>
        </AuthSplitLayout>
    );
};

export default RegisterPage;
