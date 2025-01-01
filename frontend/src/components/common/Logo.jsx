import logo from '../../assets/logo.png'
const Logo = () => {
    return (
        <div className='flex items-center gap-4 w-fit'>
            <img className='w-16' src={logo} alt="logo" />
            <h2 className='font-logo text-3xl'>FurEver Home</h2>
        </div>
    );
};

export default Logo;