import { RouterProvider, createBrowserRouter } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import PrivateRoute from './PrivateRoute';
import CommonLayout from "../layouts/CommonLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import ProfilePage from "../pages/ProfilePages/ProfilePage";
import HomePage from "../pages/HomePages/HomePage";
import LoginPage from "../pages/AuthPages/LoginPage";
import RegisterPage from "../pages/AuthPages/RegisterPage";
const router = createBrowserRouter([
    {
        path:'/',
        element: <CommonLayout/>,
        children:[
            {
                path:'/',
                element: <HomePage/>
            }
        ]
    },
    {
        path:'auth',
        element: <AuthLayout/>,
        children:[
            {
                path:'login',
                element: <LoginPage/>
            },
            {
                path:'register',
                element: <RegisterPage/>
            }
        ]
    },
    {
        path:'user',
        element: <PrivateRoute><ProfileLayout/></PrivateRoute>,
        children:[
            {
                path:'profile',
                element: <ProfilePage/>
            }
        ]
    },
    {
        path:"*",
        element: <div>Error page</div>
    }
])

const Routes = () => {
    return <RouterProvider router={router} />
}
export default Routes;


