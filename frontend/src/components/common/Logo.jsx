import logo from '../../assets/logo.jpg'
const Logo = () => {
    return (
        <div className='flex items-center gap-4 w-fit'>
            <img className='w-16' src={logo} alt="logo" />
            <h2 className='font-logo text-3xl'>PetCircle</h2>
        </div>
    );
};

export default Logo;