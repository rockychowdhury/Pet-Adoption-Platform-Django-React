import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
    const {user} = useAuth();
    return (
        <div>
            {user?.email}
        </div>
    );
};

export default Profile;