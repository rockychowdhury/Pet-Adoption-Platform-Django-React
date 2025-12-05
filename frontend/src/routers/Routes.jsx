import { RouterProvider, createBrowserRouter } from "react-router";
import PrivateRoute from './PrivateRoute';
import ProfileLayout from "../layouts/ProfileLayout";
import ProfilePage from "../pages/ProfilePages/ProfilePage";
import HomePage from "../pages/HomePages/HomePage";
import RegisterPage from "../pages/AuthPages/RegisterPage";
import ErrorComponent from "../components/common/ErrorComponent";
import PetListingPage from "../pages/PetPages/PetListingPage";
import PetDetailsPage from "../pages/PetPages/PetDetailsPage";
import Navbar from "../components/common/Navbar";

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        children: []
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
])

const Routes = () => {
    return <RouterProvider router={router} />
}
export default Routes;


