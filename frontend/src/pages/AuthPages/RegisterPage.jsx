import  useAuth  from "../../hooks/useAuth";

const RegisterPage = () => {
    const {register} = useAuth();
    const handleRegister = async(e) =>{
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");
        const first_name = form.get("first_name");
        const last_name = form.get("last_name");
        const data = {email, password, first_name, last_name};
        register(data);

    }
    return (
        <div>
            <form onSubmit={handleRegister} action="">
                <input name="email" type="email" className="border" />
                <input name="password" type="text" className="border" />
                <input name = "first_name" type="text" className="border" />
                <input name="last_name" type="text" className="border" />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;