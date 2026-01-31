import React, { useState } from 'react';
import MediaGalleryEditor from '../../../../components/Services/ProviderDashboard/MediaGalleryEditor';
import Button from '../../../../components/common/Buttons/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const MediaStep = ({ media, onSaveMedia, onNext, onBack, isLoading }) => {

    // We can allow users to skip this step or require it. 
    // Requirement said "upload media for the service" (step 5).

    // The MediaGalleryEditor handles immediate uploads? 
    // Usually it accepts an `onSave` which might just pass the list or trigger API.
    // Let's assume onSaveMedia updates the backend.

    const handleNext = () => {
        // Validation: Warn if no photos?
        if (!media || media.length === 0) {
            toast.info("Pro Tip: Profiles with photos get 3x more bookings!");
        }
        onNext();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-merriweather">Showcase Your Work</h2>
                <p className="text-text-secondary">Upload high-quality photos of your facility, happy pets, or yourself.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border">
                <MediaGalleryEditor
                    customMedia={media}
                    onSave={onSaveMedia}
                    isLoading={isLoading}
                />
            </div>

            <div className="flex justify-between pt-6 border-t mt-8">
                <Button variant="ghost" onClick={onBack} type="button">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onNext()} type="button">
                        Skip for Now
                    </Button>
                    <Button variant="primary" onClick={handleNext} type="button">
                        Next: Set Hours <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MediaStep;
