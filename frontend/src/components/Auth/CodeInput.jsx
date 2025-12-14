import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * CodeInput - 6-digit verification code input
 * Refactored to use Tailwind CSS utility classes
 */
const CodeInput = ({ value, onChange, onComplete }) => {
    const [code, setCode] = useState(value || Array(6).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (index, val) => {
        // Only allow digits
        if (val && !/^\d$/.test(val)) return;

        const newCode = [...code];
        newCode[index] = val;
        setCode(newCode);
        onChange(newCode.join(''));

        // Auto-advance to next box
        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if complete
        if (newCode.every(digit => digit !== '') && onComplete) {
            onComplete(newCode.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace: go to previous box if current is empty
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Arrow keys navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        // Only process if it's 6 digits
        if (/^\d{6}$/.test(pastedData)) {
            const newCode = pastedData.split('');
            setCode(newCode);
            onChange(pastedData);

            // Focus last box
            inputRefs.current[5]?.focus();

            // Trigger onComplete
            if (onComplete) {
                onComplete(pastedData);
            }
        }
    };

    return (
        <div className="flex gap-2 sm:gap-3 justify-center">
            {code.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-bg-secondary border border-border rounded-lg text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/20 transition-all caret-brand-secondary"
                    aria-label={`Digit ${index + 1}`}
                    autoFocus={index === 0}
                />
            ))}
        </div>
    );
};

CodeInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
};

export default CodeInput;
