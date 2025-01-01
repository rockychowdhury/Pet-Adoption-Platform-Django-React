
import Logo from '../../../components/common/Logo';
import NavLinks from './NavLinks';
import ButtonOutline from '../../../components/buttons/ButtonOutline';
import ButtonFillGradient from '../../../components/buttons/ButtonFillGradient';
const Navbar = () => {
    return (
        <div className='flex  items-center justify-between py-5 sticky top-0'>
            <Logo></Logo>
            <NavLinks></NavLinks>
            <div className='space-x-6'>
                <button>
                    <ButtonOutline>Sign In</ButtonOutline>
                </button>
                <button>
                    <ButtonFillGradient>
                        Join Now <span className="hidden  md:inline-block"> - It&apos;s free</span>
                    </ButtonFillGradient>
                </button>
            </div>
        </div>
    );
};

export default Navbar;