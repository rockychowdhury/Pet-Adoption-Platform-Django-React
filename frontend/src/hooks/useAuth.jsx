import { useContext } from "react"
import { AuthContext } from "../context/Contexts"

export const useAuth = () => {
    return useContext(AuthContext);
}