import { Outlet, useNavigate } from "react-router";
import Modal from "../components/common/Modal";
import { useEffect } from "react";
import useUIContext from "../hooks/useUIContext";
const AuthLayout = ({children}) => {
    const { setOpenModal } = useUIContext();
    const navigate = useNavigate();
    useEffect(() => {
        setOpenModal(true);
    }, []);
    const callBack = () =>{
        navigate('/');
        setOpenModal(false);
    }
    return (
        <Modal callBack={()=>callBack()}>
            {children}
        </Modal>
    );
};

export default AuthLayout;