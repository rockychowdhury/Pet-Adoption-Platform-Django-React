
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Buttons/Button';
import Card from '../../components/common/Layout/Card';

const AIApplicationPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-6 text-center">
            <Card className="max-w-md w-full p-10 space-y-6 flex flex-col items-center border-purple-100 shadow-xl shadow-purple-500/5">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-2">
                    <Sparkles size={40} />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black font-logo tracking-tight text-gray-900">
                        AI Application Assitant
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Upcoming Feature
                    </p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                    We are building an intelligent assistant to help you craft the perfect adoption application. This feature will be available in a future update.
                </p>

                <div className="w-full pt-4 space-y-3">
                    <Button
                        onClick={() => navigate(`/rehoming/listings/${id}/inquiry`)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
                    >
                        Continue to Manual Application
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="w-full"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Go Back
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AIApplicationPage;
