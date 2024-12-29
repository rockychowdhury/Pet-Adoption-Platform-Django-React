import { useContext } from "react";
import { UIContext } from "../context/Contexts";

const useUIContext = () => {
    return useContext(UIContext);
};

export default useUIContext;