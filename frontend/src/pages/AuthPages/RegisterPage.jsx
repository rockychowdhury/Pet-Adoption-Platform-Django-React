import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import useUIContext from "../../hooks/useUIContext";
import ButtonFillGradient from '../../components/buttons/ButtonFillGradient';
const RegisterPage = () => {
    const { register,error } = useAuth();
    const [view, setView] = useState(false);
    const { setOpenModal } = useUIContext();
    useEffect(() => {
        setOpenModal(true);
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");
        const first_name = form.get("first_name");
        const last_name = form.get("last_name");
        const data = { email, password, first_name, last_name };
        register(data);

    }
    return (
        // <div>
        //     <form onSubmit={handleRegister} action="">
        //         <input name="email" type="email" className="border" />
        //         <input name="password" type="text" className="border" />
        //         <input name = "first_name" type="text" className="border" />
        //         <input name="last_name" type="text" className="border" />
        //         <button type="submit">Register</button>
        //     </form>
        // </div>
        <div className="space-y-4  border-action px-10 rounded-2xl">
            <div className="text-center ">
                <div className="space-y-3  relative">
                    <Link to={-1}><FaArrowLeft className="text-2xl absolute top-1 left-0"></FaArrowLeft></Link>
                    <h2 className="font-bold text-3xl font-poppins">Register</h2>
                    <p className="opacity-70">Welcome back! Please enter your details</p>
                </div>
                <div className="h-7 text-red-500 text-center">{error}</div>
            </div>
            <form onSubmit={handleRegister} className="space-y-4 font-medium " action="">
                <label htmlFor="Email" className="relative block rounded-md border bg-transparent border-action shadow-sm focus-within:border-action_dark focus-within:ring-1 focus-within:ring-action_dark">
                    <input
                        type="email"
                        id="Email"
                        name='email'
                        required
                        className="peer bg-secondary w-full border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder="Email" />

                    <span
                        className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-secondary p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                    >
                        Email
                    </span>
                </label>
                <label htmlFor="Email" className="relative block rounded-md border bg-transparent border-action shadow-sm focus-within:border-action_dark focus-within:ring-1 focus-within:ring-action_dark">
                    <input
                        type="email"
                        id="Email"
                        name='email'
                        required
                        className="peer bg-secondary w-full border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder="Email" />

                    <span
                        className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-secondary p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                    >
                        Email
                    </span>
                </label>
                <label htmlFor="Email" className="relative block rounded-md border bg-transparent border-action shadow-sm focus-within:border-action_dark focus-within:ring-1 focus-within:ring-action_dark">
                    <input
                        type="email"
                        id="Email"
                        name='email'
                        required
                        className="peer bg-secondary w-full border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder="Email" />

                    <span
                        className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-secondary p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                    >
                        Email
                    </span>
                </label>
                <label
                    htmlFor="Password"
                    className="relative items-center flex rounded-md border border-action shadow-sm focus-within:border-action_dark focus-within:ring-1 focus-within:ring-action_dark"
                >
                    <input
                        name="password"
                        required
                        type={view ? "password" : 'text'}
                        id="Password"
                        className="peer w-full border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                        placeholder="Password"
                    />
                    <span
                        className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-secondary p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
                    >
                        Password
                    </span>
                    <button type="button" onClick={() => setView(!view)} className="pe-3 absolute right-0">
                        {
                            view ? <IoEyeOffOutline></IoEyeOffOutline> :
                                <IoEyeOutline></IoEyeOutline>
                        }
                    </button>
                </label>
                <div className="flex items-center justify-between">
                    <button type="submit"><ButtonFillGradient>Create Account</ButtonFillGradient></button>
                    <Link className="hover:text-highlight transition font-medium font-poppins opacity-70 hover:opacity-100">Forget Password?</Link>
                </div>
            </form>
            <span className="relative flex justify-center">
                <div
                    className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-action to-transparent opacity-75"
                ></div>
                <span className="relative z-10 bg-secondary px-6">or</span>
            </span>
            <div className="text-center">Don&apos;t have an account? <Link to='/register' className="text-highlight transition font-medium font-poppins opacity-70 hover:opacity-100">Register</Link></div>
        </div>
    );
};

export default RegisterPage;


