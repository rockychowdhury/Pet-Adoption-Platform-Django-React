import React from 'react';
import BusinessHoursEditor from '../../../../components/Services/ProviderDashboard/BusinessHoursEditor';
import Button from '../../../../components/common/Buttons/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BusinessHoursStep = ({ hours, onSaveHours, isLoading, onSubmit, isSubmitting }) => {

    const handleNext = () => {
        // Validation could go here
        onSubmit();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-merriweather">Set Your Schedule</h2>
                <p className="text-text-secondary">When are you available for standard services?</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border">
                <BusinessHoursEditor
                    initialHours={hours}
                    onSave={onSaveHours}
                    isLoading={isLoading}
                />
            </div>

            <div className="flex justify-between pt-6 border-t mt-8">
                {/* Back button logic needs parent to know this step */}
                <span className="text-sm text-text-tertiary">Review times before submitting</span>

                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        size="lg"
                        className="shadow-lg shadow-brand-primary/20"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting Application...' : 'Submit Application'} <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BusinessHoursStep;
