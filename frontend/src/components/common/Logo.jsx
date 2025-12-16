import logo from '../../assets/logo.png';

const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <img className='w-10 h-10 rounded-full object-contain' src={logo} alt="PetCircle Logo" />
            <h2 className='font-logo font-bold text-2xl text-[#2D2D2D]'>PetCircle</h2>
        </div>
    );
};

export default Logo;