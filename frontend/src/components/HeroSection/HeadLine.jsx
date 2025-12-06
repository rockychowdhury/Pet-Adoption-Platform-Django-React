import stars from '../../assets/stars.png';

const HeadLine = () => {
    return (
        <div className='space-y-6'>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full w-fit shadow-sm">
                <img src={stars} alt="stars" className="w-4 h-4 object-contain" />
                <span className="text-xs font-bold tracking-widest text-text-secondary uppercase">#SAVELIFE</span>
            </div>

            <h1 className='text-6xl md:text-7xl text-text-primary leading-[1.1] tracking-tight font-bold font-logo'>
                Find Your Perfect <br /> Pet <span className='text-brand-secondary'>Companion</span> <br /> Today
            </h1>

            <div className='flex items-center gap-4 pt-2'>
                <button className='px-8 py-4 bg-[#2D2D2D] text-white font-bold rounded-full transition-all duration-300 hover:bg-black hover:shadow-lg hover:-translate-y-1 active:scale-95'>
                    Adopt Now
                </button>
                <button className='px-8 py-4 bg-white text-[#2D2D2D] font-bold rounded-full transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 active:scale-95'>
                    Join Us
                </button>
            </div>
        </div>
    );
};

export default HeadLine;