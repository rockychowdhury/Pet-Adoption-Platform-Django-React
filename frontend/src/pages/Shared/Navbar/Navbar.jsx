
import Logo from '../../../components/common/Logo';
import NavLinks from './NavLinks';
import ButtonOutline from '../../../components/buttons/ButtonOutline';
import ButtonFillGradient from '../../../components/buttons/ButtonFillGradient';
import { LogOut, Bell, Heart } from 'lucide-react';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import TooltipRight from '../../../components/common/TooltipRight';


const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <div className='flex  items-center justify-between py-5 sticky top-0'>
            <Logo></Logo>
            <NavLinks></NavLinks>
            <div>
                {
                    (user && user)?.email ?
                        <div className='flex items-center gap-6'>
                            <Bell size={25} strokeWidth={2} />
                            <Heart size={25} strokeWidth={2} absoluteStrokeWidth />
                            <figure className='w-14 h-14 hover:ring-2 rounded-full transition cursor-pointer'>
                                <img className='w-full h-full rounded-full border-action' src={user?.photoURL} alt={user?.name} />
                            </figure>
                            <button className='hidden lg:block' onClick={logout}>
                                <TooltipRight content={"Logout"}>
                                    <ButtonOutline> <span className='text-orange-500 group-hover:text-white'><LogOut size={16} strokeWidth={1.5} absoluteStrokeWidth /></span> </ButtonOutline>
                                </TooltipRight>
                            </button>
                        </div> :
                        <div className='flex gap-6'>
                            <Link to="/login">
                                <ButtonOutline>Sign In</ButtonOutline>
                            </Link>
                            <Link to="/register">
                                <ButtonFillGradient>
                                    Join Now <span className="hidden  md:inline-block"> - It&apos;s free</span>
                                </ButtonFillGradient>
                            </Link>
                        </div>
                }
            </div>
        </div>
    );
};

export default Navbar;