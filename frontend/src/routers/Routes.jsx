import { RouterProvider, createBrowserRouter } from "react-router";
import PrivateRoute from './PrivateRoute';
import ProfileLayout from "../layouts/ProfileLayout";
import ProfilePage from "../pages/ProfilePages/ProfilePage";
import HomePage from "../pages/HomePages/HomePage";

import ErrorComponent from "../components/common/ErrorComponent";
import PetListingPage from "../pages/PetPages/PetListingPage";
import PetDetailsPage from "../pages/PetPages/PetDetailsPage";
import CommunityPage from "../pages/CommunityPages/CommunityPage";
import Navbar from "../components/common/Navbar";
import DashboardLayout from "../layouts/DashboardLayout";
import ShelterDashboard from "../pages/Dashboard/ShelterDashboard";
import AdopterDashboard from "../pages/Dashboard/AdopterDashboard";
import useAuth from "../hooks/useAuth";

// Helper component to render correct dashboard
const RoleBasedDashboard = () => {
    const { user } = useAuth();
    if (user?.role === 'shelter') return <ShelterDashboard />;
    return <AdopterDashboard />;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/pets',
        element: <><Navbar /><PetListingPage /></>
    },
    {
        path: '/pets/:id',
        element: <><Navbar /><PetDetailsPage /></>
    },
    {
        path: '/community',
        element: <><Navbar /><CommunityPage /></>
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <RoleBasedDashboard />
            },
            {
                path: 'pets',
                element: <ShelterDashboard />
            },
            {
                path: 'applications',
                element: <ShelterDashboard />
            },
            {
                path: 'saved',
                element: <AdopterDashboard />
            }
        ]
    },
    {
        path: 'user',
        element: <PrivateRoute><ProfileLayout /></PrivateRoute>,
        children: [
            {
                path: 'profile',
                element: <ProfilePage />
            }
        ]
    },
    {
        path: "*",
        element: <ErrorComponent />
    }
]);

const Routes = () => {
    return <RouterProvider router={router} />
}
export default Routes;
