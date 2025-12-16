import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Edit Profile is now handled within the main Profile/Settings page
        navigate('/dashboard/profile');
    }, [navigate]);

    return null;
};

export default EditProfilePage;
