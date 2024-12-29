
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/common/Spinner";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) return <Spinner></Spinner>;
    console.log(loading,user);
    if (user && user?.email) {
        return children;
    }
    return <Navigate state={location.pathname} to='/auth/login'></Navigate>
};
PrivateRoute.propTypes = {
    children: PropTypes.any,
}
export default PrivateRoute;