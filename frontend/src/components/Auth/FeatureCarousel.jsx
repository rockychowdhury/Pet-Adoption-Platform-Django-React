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
            headline: 'Find Your Perfect Companion',
            subheading: 'Connect with verified pets needing loving homes.',
            image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2086&auto=format&fit=crop", // Dog running
            tags: ['Verified Pets', 'Safe Adoption']
        },
        {
            id: 2,
            headline: 'Rehome Responsibly',
            subheading: 'Find the perfect new family for your pet with our guided process.',
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop", // Cat close up
            tags: ['Secure Process', 'Vetted Adopters']
        },
        {
            id: 3,
            headline: 'Join Our Community',
            subheading: 'Be part of a growing network of pet lovers and advocates.',
            image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop", // Dogs playing
            tags: ['Community', 'Support']
        }
    ];

    useEffect(() => {
        if (!isPaused) {
            const timer = setInterval(() => {
                setActiveSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [isPaused, slides.length]);

    return (
        <div
            className="relative w-full h-full overflow-hidden bg-gray-900 rounded-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100 scale-100 ring-0' : 'opacity-0 scale-105'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img
                            src={slide.image}
                            alt={slide.headline}
                            className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-12 text-left z-10">
                        <div className="mb-4 flex gap-2">
                            {slide.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10 uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-3 leading-tight font-logo drop-shadow-sm">
                            {slide.headline}
                        </h2>
                        <p className="text-lg text-gray-200 font-light max-w-md drop-shadow-sm">
                            {slide.subheading}
                        </p>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-12 right-12 flex gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeatureCarousel;
