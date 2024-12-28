import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
const LoginPage = () => {
    const { login} = useAuth();
    const handleLogin = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");
        login({email,password});
        // console.log({ email, password });
        
    }
    return (
        <div>
            <Link to="/">home</Link>
            <form onSubmit={handleLogin} className="border p-5 flex flex-col gap-5" action="">
                <input className="border" name="email" type="email" />
                <input className="border" name="password" type="password" />
                <button type="submit"> Login</button>
            </form>
        </div>
    );
};

export default LoginPage;