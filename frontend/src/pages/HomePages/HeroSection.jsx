import banner from '../../assets/bannerimg.png'
import HeadLine from '../../components/HeroSection/HeadLine';
import SubHeading from '../../components/HeroSection/SubHeading';
import Caution from '../../components/HeroSection/Caution';
import ActiveShelters from '../../components/HeroSection/ActiveShelters';
import Star from '../../components/HeroSection/Star';
import StarCouple from '../../components/HeroSection/StarCouple';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import star from '../../assets/star.png';

const HeroSection = () => {
    return (
        <div className='relative overflow-x-hidden min-h-screen bg-bg-primary pt-12'>
            <div className='w-16 top-32 left-[43%] absolute opacity-50'><StarCouple></StarCouple></div>
            <div className='w-24 top-80 left-[55%] absolute opacity-50'><Star></Star></div>
            <div className='w-12 right-128 top-20 absolute opacity-50'><Star></Star></div>

            <div className="max-w-[1440px] mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                <div className='space-y-8 flex-1 max-w-2xl'>
                    <HeadLine></HeadLine>
                    <SubHeading></SubHeading>
                    <ActiveShelters></ActiveShelters>
                </div>

                <div className='relative flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0'>
                    {/* Image Card with Depth */}
                    <div className="relative z-10 transform rotate-2 hover:rotate-0 transition-all duration-500 group">
                        <div className="card p-3 bg-white pb-12 max-w-md shadow-2xl border-4 border-white">
                            <div className="relative overflow-hidden rounded-2xl h-[500px]">
                                <img className='w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105' src={banner} alt="Pet" />

                                {/* Verified Badge */}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm text-text-secondary">
                                    <div className="w-4 h-4 bg-brand-secondary rounded-full flex items-center justify-center">
                                        <img src={star} alt="Verified" className="w-3 h-3 object-contain" />
                                    </div>
                                    Verified shelters & listings
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge (Bottom Right) */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-soft flex items-center gap-3 animate-bounce-slow border border-border">
                            <div className="bg-brand-secondary/10 p-2.5 rounded-full text-brand-secondary">
                                <Heart size={20} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">100% Love</p>
                                <p className="text-sm font-bold text-text-primary">Guaranteed</p>
                            </div>
                        </div>

                        {/* Floating Badge (Bottom Left - Action) */}
                        <div className="absolute bottom-20 -left-10 bg-black/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 transform -rotate-2">
                            <Sparkles size={16} className="text-brand-secondary" />
                            <span className="text-sm font-bold">Adopt Now • Save a Life</span>
                        </div>
                    </div>

                    {/* Background Blob for Depth */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-secondary/5 blur-3xl -z-10 rounded-full"></div>
                </div>
            </div>

            <div className='mt-24 transform -rotate-1'>
                <Caution></Caution>
            </div>
            <div className='w-full h-20'></div>
        </div>
    );
};

export default HeroSection;