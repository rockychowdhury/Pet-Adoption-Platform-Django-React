import React from 'react';
import { CheckCircle } from 'lucide-react';
import { calculateCompletion } from '../../utils/petProfileUtils';

const PetProfileStrengthCard = ({ values }) => {
    const { score, total, missing } = calculateCompletion(values);
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="bg-white border border-border p-6 rounded-[1.5rem] shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-text-primary uppercase tracking-wide">Profile Strength</h4>
                <span className="text-xs font-black bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-lg">
                    {percentage}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${score === total ? 'bg-status-success' : 'bg-brand-primary'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <p className="text-xs text-text-secondary font-medium">
                {score}/{total} Requirements Met
            </p>

            {missing.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                    <p className="text-[10px] uppercase font-black text-text-tertiary">Missing for Completion:</p>
                    <ul className="space-y-2">
                        {missing.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-medium text-status-warning">
                                <div className="w-1.5 h-1.5 rounded-full bg-status-warning flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {score === total && (
                <div className="flex items-center gap-2 text-status-success bg-status-success/5 p-3 rounded-xl border border-status-success/10">
                    <CheckCircle size={16} />
                    <span className="text-xs font-bold">Profile is Complete!</span>
                </div>
            )}
        </div>
    );
};

export default PetProfileStrengthCard;
