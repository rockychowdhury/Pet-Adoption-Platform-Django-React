import React from 'react';
import * as Icons from 'lucide-react';
import Card from '../../../../components/common/Layout/Card';
import { Loader } from 'lucide-react';

const CategorySelectionStep = ({ categories, selectedCategory, onSelect, isLoading }) => {

    // Safety check just in case
    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader className="animate-spin text-brand-primary" size={32} />
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center p-8 text-text-secondary">
                No service categories available at the moment.
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold font-merriweather text-center mb-6">Select Your Primary Service</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                    // Dynamic Icon Logic
                    const IconComponent = Icons[category.icon_name] || Icons.HelpCircle;
                    const isSelected = selectedCategory === category.id;

                    return (
                        <div
                            key={category.id}
                            onClick={() => onSelect(category.id)}
                            className={`
                                cursor-pointer rounded-xl border-2 p-6 transition-all duration-200
                                hover:-translate-y-1 hover:shadow-md
                                ${isSelected
                                    ? 'border-brand-primary bg-brand-primary/5 shadow-brand-primary/20'
                                    : 'border-gray-200 bg-white hover:border-brand-primary/50'}
                            `}
                        >
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center mb-4
                                ${isSelected ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'}
                            `}>
                                <IconComponent size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-text-primary">{category.name}</h3>
                            <p className="text-text-secondary text-sm line-clamp-2">{category.description}</p>
                        </div>
                    );
                })}
            </div>

            <div className="text-center pt-8 text-sm text-text-secondary">
                <p>Don't see your category? Contact support.</p>
            </div>
        </div>
    );
};

export default CategorySelectionStep;
