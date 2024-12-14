
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
const HomePage = () => {
    const {logout}= useAuth();
    return (
        <div className='flex flex-col'>
            Home HomePage
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/register">Register</Link>
            <Link to="/profile">profile</Link>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default HomePage;