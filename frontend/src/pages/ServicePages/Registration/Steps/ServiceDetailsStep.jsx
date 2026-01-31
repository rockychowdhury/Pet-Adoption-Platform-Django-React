import React from 'react';
import Input from '../../../../components/common/Form/Input';
import Textarea from '../../../../components/common/Form/Textarea';
import Button from '../../../../components/common/Buttons/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ServiceDetailsStep = ({ formData, handleChange, handleMultiSelect, onNext, onBack, categories, speciesList, serviceOptions, isSaving }) => {

    const selectedCategory = categories.find(c => c.id == formData.category);
    const slug = selectedCategory?.slug;
    const categoryName = selectedCategory?.name || 'Service';

    const isVet = slug === 'veterinary';
    const isFoster = slug === 'foster';
    const isTrainer = slug === 'training';
    const isGroomer = slug === 'grooming';
    const isSitter = slug === 'pet_sitting';

    // Helper to render species checkboxes
    const renderSpeciesSelector = () => (
        <div className="mt-4">
            <label className="block text-sm font-bold text-text-primary mb-3">Accepted Species</label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                {speciesList.map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                        <input
                            type="checkbox"
                            value={s.id}
                            checked={formData.species_ids?.includes(s.id)}
                            onChange={(e) => handleMultiSelect(e, 'species_ids')}
                            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-sm">{s.name}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    // Helper to render service checkboxes for vets
    const renderServiceSelector = () => (
        <div className="mt-4">
            <label className="block text-sm font-bold text-text-primary mb-3">Services Offered</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-3 border rounded-lg bg-gray-50">
                {serviceOptions.filter(o => o.category === parseInt(formData.category)).map(o => (
                    <label key={o.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            value={o.id}
                            checked={formData.services_ids?.includes(o.id)}
                            onChange={(e) => handleMultiSelect(e, 'services_ids')}
                            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-sm">{o.name}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    // Helper to determine the prefix for nested form data based on service type
    const getTypePrefix = () => {
        if (isTrainer) return 'trainer';
        if (isGroomer) return 'groomer';
        if (isSitter) return 'sitter';
        return '';
    };

    // Placeholder for specialization selector (if needed for trainer)
    const renderSpecializationSelector = () => (
        <div className="mt-4">
            <Input
                label="Specialization (e.g., Obedience, Agility)"
                name="trainer_details.specialization"
                value={formData.trainer_details?.specialization || ''}
                onChange={handleChange}
                placeholder="e.g. Puppy Training, Behavior Modification"
            />
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl border border-border animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-merriweather">Service Details</h2>
                <p className="text-text-secondary">Specifics for your <strong>{categoryName}</strong> service.</p>
            </div>

            <div className="space-y-4">
                {/* --- Foster Specifics --- */}
                {isFoster && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-brand-primary border-b pb-1">Capacity & Rates</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Max Capacity"
                                type="number"
                                name="capacity"
                                value={formData.capacity || ''}
                                onChange={handleChange}
                                min="0"
                            />
                            <Input
                                label="Daily Rate ($)"
                                type="number"
                                name="daily_rate"
                                value={formData.daily_rate || ''}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>
                        {renderSpeciesSelector()}
                    </div>
                )}

                {/* --- Vet Specifics --- */}
                {isVet && (
                    <div className="space-y-4">
                        <Textarea
                            label="Pricing & Consultation Info"
                            name="pricing_info"
                            value={formData.pricing_info || ''}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Consultation fees, emergency rates..."
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Clinic Type"
                                name="clinic_type"
                                value={formData.clinic_type || ''}
                                onChange={handleChange}
                                placeholder="e.g. Small Animal, Emergency..."
                            />
                            {/* Add more compact vet fields here if needed */}
                        </div>
                        {renderServiceSelector()}
                        {renderSpeciesSelector()}
                    </div>
                )}

                {/* --- Trainer / Groomer / Sitter Shared Structure --- */}
                {(isTrainer || isGroomer || isSitter) && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-brand-primary border-b pb-1">Experience & Pricing</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Years of Experience"
                                type="number"
                                name="years_experience"
                                value={formData.years_experience || ''}
                                onChange={handleChange}
                                min="0"
                            />
                            {isSitter && (
                                <Input
                                    label="Service Radius (km)"
                                    type="number"
                                    name="service_radius_km"
                                    value={formData.service_radius_km || ''}
                                    onChange={handleChange}
                                />
                            )}
                            {(isGroomer || isTrainer) && (
                                <Input
                                />
                            )}

                            {isSitter && (
                                <>
                                    <Input label="Dog Walking Rate ($)" type="number" name="walking_rate" value={formData.walking_rate || ''} onChange={handleChange} placeholder="Per walk" />
                                    <Input label="House Sitting Rate ($)" type="number" name="house_sitting_rate" value={formData.house_sitting_rate || ''} onChange={handleChange} placeholder="Per night" />
                                    <Input label="Drop-in Visit Rate ($)" type="number" name="drop_in_rate" value={formData.drop_in_rate || ''} onChange={handleChange} placeholder="Per visit" />
                                </>
                            )}
                        </div>

                        {renderSpeciesSelector()}
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6 border-t mt-8">
                <Button variant="ghost" onClick={onBack} type="button">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onNext(false)} // Save draft
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => onNext(true)} // Next
                        disabled={isSaving}
                    >
                        Next: Upload Media <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsStep;
