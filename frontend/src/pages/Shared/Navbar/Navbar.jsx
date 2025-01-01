
import Logo from '../../../components/common/Logo';
import NavLinks from './NavLinks';
import ButtonOutline from '../../../components/buttons/ButtonOutline';
import ButtonFillGradient from '../../../components/buttons/ButtonFillGradient';
import { Link } from 'react-router';
const Navbar = () => {
    return (
        <div className='flex  items-center justify-between py-5 sticky top-0'>
            <Logo></Logo>
            <NavLinks></NavLinks>
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
        </div>
    );
};

export default Navbar;