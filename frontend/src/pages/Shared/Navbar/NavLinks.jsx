import { NavLink } from "react-router";
import useAuth from '../../../hooks/useAuth';
import { IoHomeOutline } from "react-icons/io5";
import { FileText,PawPrint } from 'lucide-react';
const NavLinks = () => {
    const { user } = useAuth();
    const publicLinks = [
        { path: '/', name: <button className="flex items-center gap-2"><IoHomeOutline></IoHomeOutline><span>Home</span></button> },
        { path: '/pets', name: <button className="flex items-center gap-2"><PawPrint size={16} strokeWidth={2} /><span>Explore Pets</span></button> }
    ]
    const privateLinks = [
        ...publicLinks,
        { path: '/applications', name: <button className="flex items-center gap-2"><FileText size={16} strokeWidth={2} /><span>Applications</span></button>, private: true },
        { path: '', name: '', private: true },
        { path: '', name: '', private: true },
        { path: '', name: '', private: true }
    ]
    return (
        <ul className="flex items-center lg:gap-6">
            {
                privateLinks.map((link, idx) =>
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