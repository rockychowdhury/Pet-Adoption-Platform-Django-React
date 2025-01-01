import banner from '../../assets/bannerimg.png'
import HeadLine from '../../components/HeroSection/HeadLine';
import SubHeading from '../../components/HeroSection/SubHeading';
import Caution from '../../components/HeroSection/Caution';
import ActiveShelters from '../../components/HeroSection/ActiveShelters';
import Star from '../../components/HeroSection/Star';
import StarCouple from '../../components/HeroSection/StarCouple';
const HeroSection = () => {
    return (
        <div className='relative overflow-x-hidden '>
            <div className='w-16 top-32 left-[43%] absolute'><StarCouple></StarCouple></div>
            <div className='w-24 top-80 left-[55%] absolute'><Star></Star></div>
            <div className='w-12 right-128 top-20  absolute'><Star></Star></div>
            <div className="max-w-screen-2xl mx-auto space-y-8 flex items-end justify-between">
                <div className='space-y-8'>
                    <HeadLine></HeadLine>
                    <SubHeading></SubHeading>
                    <ActiveShelters></ActiveShelters>
                </div>
                <figure className='relative top-[37px] z-50 left-24 -rotate-2'>
                    <img className='w-full h-full object-cover object-center' src={banner} alt="" />
                </figure>
            </div>
            <div  className=''>
                <Caution></Caution>
            </div>
            <div className='w-full h-32'></div>
        </div>
    );
};

export default HeroSection;