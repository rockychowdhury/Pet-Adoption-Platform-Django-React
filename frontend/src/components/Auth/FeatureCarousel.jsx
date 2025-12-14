import React, { useState, useEffect } from 'react';

/**
 * FeatureCarousel - Auto-rotating carousel for auth pages
 * 3 slides showcasing PetCircle features
 * Refactored to use Tailwind CSS utility classes
 */
const FeatureCarousel = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            id: 1,
            headline: 'Find Loving Homes for Pets',
            subheading: 'Connect with verified adopters through our responsible rehoming system',
            features: [
                'Verified adopters and pet owners',
                'Detailed behavioral assessments',
                'Safe application process',
                'Post-adoption support'
            ],
            // Using a gradient background as placeholder
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            bgImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&h=1080&fit=crop' // Family with dog
        },
        {
            id: 2,
            headline: 'Quality Pet Care Services',
            subheading: 'Find verified foster care providers and veterinary clinics in your area',
            features: [
                'Licensed foster care providers',
                'Certified veterinary clinics',
                'Real client reviews',
                'Easy booking and contact'
            ],
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            bgImage: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1920&h=1080&fit=crop' // Vet clinic
        },
        {
            id: 3,
            headline: 'Join a Caring Community',
            subheading: 'Connect with fellow pet lovers, share experiences, and build lasting friendships',
            features: [
                'Share pet moments and stories',
                'Connect with local pet owners',
                'Join community groups',
                'Attend pet-friendly events'
            ],
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            bgImage: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=1920&h=1080&fit=crop' // Pet community
        }
    ];

    // Auto-rotate every 5 seconds
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setActiveSlide((prev) => (prev + 1) % slides.length);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isPaused, slides.length]);

    const goToSlide = (index) => {
        setActiveSlide(index);
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            background: slide.background,
                            backgroundImage: `url(${slide.bgImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex items-center justify-center p-8 md:p-16 z-20">
                        <div className="max-w-[500px] text-center">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                {slide.headline}
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 mb-8 font-normal drop-shadow-md">
                                {slide.subheading}
                            </p>
                            <ul className="list-none p-0 m-0 text-left inline-block">
                                {slide.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm md:text-base text-white/90 mb-2 pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-brand-secondary drop-shadow-sm">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dot Navigation */}
            <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-30 transition-opacity duration-300 ${isPaused ? 'opacity-100' : 'opacity-70'}`}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-125 hover:bg-white ${index === activeSlide
                                ? 'w-3 h-3 bg-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                                : 'bg-white/40'
                            }`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeatureCarousel;
