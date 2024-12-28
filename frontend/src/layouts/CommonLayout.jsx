import { Outlet } from "react-router";

const CommonLayout = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default CommonLayout;