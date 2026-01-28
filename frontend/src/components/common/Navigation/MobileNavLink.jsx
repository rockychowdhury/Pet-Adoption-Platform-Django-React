import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MobileNavLink = ({ to, label, onClick, active }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`block px-4 py-3 text-lg font-black rounded-xl transition-all duration-300 ${active
            ? 'bg-bg-secondary text-text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
            }`}
    >
        {label}
    </Link>
);

MobileNavLink.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    active: PropTypes.bool,
};

export default MobileNavLink;
