import React from 'react';
import { Search, RefreshCcw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../Buttons/Button';
import noResultsImage from '../../../assets/no_results_dog.png'; // Updated later if needed

const NoResults = ({
    title = "No companions found",
    description = "Try adjusting your filters to find more friends",
    onReset,
    icon: Icon = Search,
    backgroundText = "EMPTY"
}) => {
    return (
        <div className="relative py-24 px-4 overflow-hidden bg-bg-primary rounded-[64px]">
            {/* Background Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[20rem] font-black text-bg-secondary select-none pointer-events-none z-0 uppercase tracking-tighter">
                {backgroundText}
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center font-jakarta">
                {/* Image Section */}
                <div className="relative mb-12">
                    <motion.div
                        initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
                        animate={{ rotate: -5, scale: 1, opacity: 1 }}
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="w-56 h-56 md:w-72 md:h-72 rounded-[48px] overflow-hidden shadow-2xl border-8 border-white bg-bg-secondary relative"
                    >
                        <img
                            src={noResultsImage}
                            alt="No Results"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Icon Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="absolute -top-4 -right-4 w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-bg-primary"
                    >
                        <Icon size={28} strokeWidth={2.5} />
                    </motion.div>
                </div>

                {/* Text Content */}
                <h3 className="text-4xl md:text-5xl font-logo font-black text-text-primary mb-4 leading-tight">
                    {title}
                </h3>
                <p className="text-text-secondary text-lg mb-12 max-w-sm mx-auto font-medium">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={onReset}
                        className="w-full sm:w-auto px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 active:scale-95"
                    >
                        <RefreshCcw size={18} />
                        Reset All Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export { NoResults };
export default NoResults;
