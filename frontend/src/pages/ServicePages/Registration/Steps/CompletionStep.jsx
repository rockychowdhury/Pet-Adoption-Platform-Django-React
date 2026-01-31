import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../../../../components/common/Buttons/Button';
import { useNavigate } from 'react-router-dom';

const CompletionStep = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto text-center pt-12 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-green-200 shadow-lg">
                <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">Application Submitted!</h2>
            <p className="text-text-secondary mb-8 text-lg">
                Thank you for applying to become a Pet Circle Service Provider.
                Our team is reviewing your details. You can track your status on your dashboard.
            </p>

            <div className="space-y-4">
                <Button
                    onClick={() => navigate('/provider/dashboard')}
                    variant="primary"
                    size="lg"
                    className="w-full"
                >
                    Go to Provider Dashboard <ArrowRight className="ml-2" />
                </Button>
                <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="w-full text-text-secondary"
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
};

export default CompletionStep;
