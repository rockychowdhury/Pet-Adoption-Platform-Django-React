import { useState } from "react";
import { toast } from 'react-toastify'
import { UIContext } from "./Contexts";
import PropTypes from "prop-types";
const UIProvider = ({ children }) => {
    const [openModal, setOpenModal] = useState();
    const showToast = (type, message) => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast.info(message);
    }
    const context = {
        openModal, setOpenModal, showToast
    }
    return <UIContext.Provider value={context}>{children}</UIContext.Provider>
};
UIProvider.propTypes = {
    children: PropTypes.any,
}
export default UIProvider;