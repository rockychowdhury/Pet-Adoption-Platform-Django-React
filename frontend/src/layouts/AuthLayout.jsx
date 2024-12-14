import { Outlet } from "react-router";
const AuthLayout = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <h1>auth HomePage</h1>
            <Outlet />
        </div>
    );
};

export default AuthLayout;