import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DropdownLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors duration-200"
    >
        {icon}
        {label}
    </Link>
);

DropdownLink.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
};

export default DropdownLink;
