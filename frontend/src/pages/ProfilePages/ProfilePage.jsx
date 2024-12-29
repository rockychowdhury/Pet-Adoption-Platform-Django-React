import useAuth from '../../hooks/useAuth';

const ProfilePage = () => {
    const { user } = useAuth();
    return (
        <div>
            {user?.email}
        </div>
    );
};

export default ProfilePage;