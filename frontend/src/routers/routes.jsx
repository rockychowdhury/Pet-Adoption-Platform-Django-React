import { Route, Routes } from "react-router";
import HomePage from "../pages/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from '../pages/LoginPage';
import RegisterPage from "../pages/RegisterPage";
import Profile from "../components/user/Profile";
import PrivateRoute from './PrivateRoute';
const AllRoutes = () => {
    return (
        <Routes>
            
            <Route path="/" element={<HomePage />}></Route>
            <Route path="auth" element={<AuthLayout />} >
                <Route index path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>
            < Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<div>Error</div>} />
        </Routes>
    );
};

export default AllRoutes;