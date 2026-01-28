import React from 'react';
import FosterForm from './FosterForm';
import VetForm from './VetForm';
import TrainerForm from './TrainerForm';

const ServiceSpecificForm = ({ provider, onSave, isLoading }) => {
    // Determine category slug or name
    const categorySlug = provider.category?.slug?.toLowerCase();

    if (!categorySlug) return <div className="text-red-500">Error: No category assigned to provider.</div>;

    if (categorySlug === 'foster') {
        return <FosterForm initialData={provider.foster_details} onSave={(data) => onSave({ foster_details: data })} isLoading={isLoading} />;
    } else if (categorySlug === 'veterinary') {
        return <VetForm initialData={provider.vet_details} onSave={(data) => onSave({ vet_details: data })} isLoading={isLoading} />;
    } else if (categorySlug === 'trainer' || categorySlug === 'training') {
        return <TrainerForm initialData={provider.trainer_details} onSave={(data) => onSave({ trainer_details: data })} isLoading={isLoading} />;
    }

    return (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
            Service form not available for category: {provider.category.name}
        </div>
    );
};

export default ServiceSpecificForm;
