import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const completedRef = useRef(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft(`${minutes}m ${seconds}s`);
                return false; // Not complete
            } else {
                setTimeLeft('0m 0s');
                return true; // Complete
            }
        };

        // Initial check
        if (calculateTimeLeft()) {
            if (!completedRef.current) {
                completedRef.current = true;
                if (onComplete) onComplete();
            }
            return;
        }

        const timer = setInterval(() => {
            const isDone = calculateTimeLeft();
            if (isDone) {
                clearInterval(timer);
                if (!completedRef.current) {
                    completedRef.current = true;
                    if (onComplete) onComplete();
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            <Clock size={12} />
            <span>{timeLeft}</span>
        </div>
    );
};

export default CountdownTimer;
