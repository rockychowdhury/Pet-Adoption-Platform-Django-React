import { useContext } from "react";
import { AuthContext } from "../context/Contexts";

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;