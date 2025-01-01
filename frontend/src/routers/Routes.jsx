import { RouterProvider, createBrowserRouter } from "react-router";
import PrivateRoute from './PrivateRoute';
import ProfileLayout from "../layouts/ProfileLayout";
import ProfilePage from "../pages/ProfilePages/ProfilePage";
import HomePage from "../pages/HomePages/HomePage";
import LoginPage from "../pages/AuthPages/LoginPage";
import RegisterPage from "../pages/AuthPages/RegisterPage";
const router = createBrowserRouter([
    {
        path:'/',
        element:<HomePage/>,
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


