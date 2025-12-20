import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * SectionCursor component
 * @param {string} label - The text to display in the caption
 * @param {React.ReactNode} icon - Optional icon to display next to the label
 * @param {boolean} active - Whether the cursor caption is active
 * @param {React.ReactNode} children - The content to wrap
 */
const SectionCursor = ({ label, icon, children, className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Mouse Position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth Spring Motion (Snappier for Premium feel)
    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        if (isHovered) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isHovered, mouseX, mouseY]);

    return (
        <div
            className={`relative group/cursor ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            {/* Cursor Caption */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.5
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                    position: 'fixed',
                    left: springX,
                    top: springY,
                    x: 20, // Offset from cursor
                    y: 20,
                    pointerEvents: 'none',
                    zIndex: 9999,
                }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-surface/80 backdrop-blur-md border border-brand-primary/20 rounded-full shadow-2xl"
            >
                {icon && <span className="text-brand-primary">{icon}</span>}
                <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em] whitespace-nowrap">
                    {label}
                </span>
            </motion.div>
        </div>
    );
};

export default SectionCursor;
