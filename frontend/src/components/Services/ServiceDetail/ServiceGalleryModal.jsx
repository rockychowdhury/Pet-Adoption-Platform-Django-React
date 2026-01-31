import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ServiceGalleryModal = ({ isOpen, onClose, images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!isOpen || !images || images.length === 0) return null;

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors" onClick={onClose}>
                <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center px-4">
                {images.length > 1 && (
                    <button
                        className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        onClick={handlePrev}
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}

                <img
                    src={images[currentIndex].file_url || images[currentIndex]}
                    alt={`Gallery image ${currentIndex + 1}`}
                    className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />

                {images.length > 1 && (
                    <button
                        className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        onClick={handleNext}
                    >
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4 py-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-brand-primary scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                        <img src={img.file_url || img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceGalleryModal;
