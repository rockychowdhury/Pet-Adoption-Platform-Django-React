import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Dog, Camera, FileText } from 'lucide-react';
import Card from '../../components/common/Layout/Card';

const RehomingPetCompletionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pet } = location.state || {};

    if (!pet) {
        // Fallback if accessed directly without state
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">No Pet Selected</h1>
                <Link to="/rehoming/select-pet" className="btn btn-primary">Select a Pet</Link>
            </div>
        );
    }

    // Helper: Determine missing fields (Mock logic or based on real data if available)
    // Assuming 'pet' object has these fields. 
    // If backend only gives 'profile_is_complete', we might not know EXACTLY what is missing without more data.
    // For now, we list requirements and mark based on presence.

    const requirements = [
        { label: "Name", isComplete: !!pet.name, icon: CheckCircle2 },
        { label: "Species", isComplete: !!pet.species, icon: CheckCircle2 },
        { label: "Breed", isComplete: !!pet.breed, icon: CheckCircle2 },
        { label: "Age / Birth Date", isComplete: !!pet.age || !!pet.birth_date, icon: CheckCircle2 },
        { label: "Gender", isComplete: !!pet.gender, icon: CheckCircle2 },
        { label: "Description", isComplete: !!(pet.description && pet.description.length > 20), icon: FileText },
        { label: "Photo", isComplete: !!(pet.media && pet.media.length > 0), icon: Camera },
    ];

    return (
        <div className="min-h-screen bg-bg-secondary/30 py-12 md:py-20">
            <div className="max-w-2xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md mb-4 overflow-hidden">
                        {pet.media && pet.media.length > 0 ? (
                            <img src={pet.media[0].url} alt={pet.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-brand-secondary/10 flex items-center justify-center rounded-full">
                                <Dog className="w-10 h-10 text-brand-secondary" />
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
                        Let's Complete {pet.name}'s Profile
                    </h1>
                    <p className="text-text-secondary text-lg">
                        A complete profile helps find the perfect home.
                    </p>
                </div>

                {/* Checklist Card */}
                <Card className="p-8 mb-8 border-t-4 border-t-yellow-400 shadow-lg">
                    <div className="space-y-4 mb-8">
                        {requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${req.isComplete ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {req.isComplete ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    </div>
                                    <span className={`font-medium ${req.isComplete ? 'text-text-primary' : 'text-text-secondary'}`}>
                                        {req.label}
                                    </span>
                                </div>
                                {!req.isComplete && <span className="text-yellow-600 text-xs font-bold uppercase tracking-wider">Required</span>}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4">
                        <Link
                            to={`/pets/${pet.id}/edit`} // Assuming edit route
                            className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
                        >
                            Complete {pet.name}'s Profile <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/rehoming/select-pet"
                            className="text-center text-text-secondary hover:text-text-primary flex items-center justify-center gap-2 py-2"
                        >
                            <ArrowLeft size={16} /> Go Back
                        </Link>
                    </div>
                </Card>

                {/* Info Note */}
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-center">
                    <p className="font-medium">
                        Did you know?
                    </p>
                    <p className="text-sm mt-1">
                        A detailed profile with photos increases adoption success by 3x.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default RehomingPetCompletionPage;
