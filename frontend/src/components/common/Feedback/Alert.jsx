import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({
    variant = 'info', // success, error, warning, info
    title,
    children,
    onClose,
    className = '',
    ...props
}) => {
    const variants = {
        info: {
            container: 'bg-status-info/10 border-status-info/20 text-status-info',
            icon: <Info size={20} />,
        },
        success: {
            container: 'bg-status-success/10 border-status-success/20 text-status-success',
            icon: <CheckCircle size={20} />,
        },
        warning: {
            container: 'bg-status-warning/10 border-status-warning/20 text-status-warning',
            icon: <AlertTriangle size={20} />,
        },
        error: {
            container: 'bg-status-error/10 border-status-error/20 text-status-error',
            icon: <AlertCircle size={20} />,
        },
    };

    const currentVariant = variants[variant] || variants.info;

    return (
        <div
            className={`relative flex items-start p-4 rounded-xl border ${currentVariant.container} ${className}`}
            role="alert"
            {...props}
        >
            <div className="shrink-0 mr-3 mt-0.5">
                {currentVariant.icon}
            </div>

            <div className="flex-1 mr-2">
                {title && <h5 className="font-bold mb-1">{title}</h5>}
                <div className="text-sm opacity-90 leading-relaxed">
                    {children}
                </div>
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity p-1 -mr-2 -mt-2 hover:bg-black/5 rounded-full"
                    aria-label="Close alert"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

Alert.propTypes = {
    variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    className: PropTypes.string,
};

export default Alert;
