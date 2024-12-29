import axios from "axios";
import { baseURL } from "../utils/baseURL";

const axiosInstance = axios.create(
    {
        baseURL:baseURL,
        withCredentials:true,
    }
)

const useAPI = () => {
    return axiosInstance
};

export default useAPI;