import { NavLink } from "react-router";
import useAuth from '../../../hooks/useAuth';

const NavLinks = () => {
    const {user} = useAuth();
    const publicLinks = [
        { path: '/', name: 'Home' },
        { path: '/pets', name: 'Explore Pets' }
    ]

    return (
        <ul className="flex items-center lg:gap-6">
            {
                publicLinks.map((link, idx) =>
                    link?.private && !user ? null : (
                        <li key={idx}>
                            <NavLink to={link.path} className={({ isActive }) => isActive ? "text-action font-semibold underline underline-offset-4 transition" : "hover:font-semibold  hover:text-action/80 transition"}>
                                {link.name}
                            </NavLink>
                        </li>
                    )
                )
            }
        </ul>
    );
};

export default NavLinks;