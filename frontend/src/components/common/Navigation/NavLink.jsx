import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavLink = ({ to, label, active }) => (
    <Link
        to={to}
        className={`relative px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ease-out  ${active
            ? 'bg-brand-primary/10 text-brand-primary'
            : 'text-text-secondary/70 hover:text-text-primary hover:bg-bg-secondary'
            }`}
    >
        {label}
    </Link>
);

NavLink.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    active: PropTypes.bool,
};

export default NavLink;
