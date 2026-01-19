import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/common/Spinner";
import { Navigate, useLocation } from "react-router-dom";

/**
 * AdminRoute - Protects routes that require admin role
 * Redirects non-admin users to home page
 */
export const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Spinner />;

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

AdminRoute.propTypes = {
    children: PropTypes.any,
};

/**
 * ServiceProviderRoute - Protects routes that require service provider role
 * Redirects non-providers to become-provider page
 */
export const ServiceProviderRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Spinner />;

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    if (user.role !== 'service_provider') {
        return <Navigate to="/become-provider" replace />;
    }

    return children;
};

ServiceProviderRoute.propTypes = {
    children: PropTypes.any,
};

/**
 * PrivateRoute - Protects routes that require authentication
 * Redirects to login if not authenticated
 */
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Spinner />;

    if (user && user?.email) {
        return children;
    }

    return <Navigate state={{ from: location.pathname }} to="/login" replace />;
};

PrivateRoute.propTypes = {
    children: PropTypes.any,
};

export default PrivateRoute;