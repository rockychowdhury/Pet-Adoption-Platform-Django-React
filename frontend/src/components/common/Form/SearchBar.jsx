import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';

const SearchBar = ({
    onSearch,
    placeholder = 'Search...',
    className = '',
    ...props
}) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    const handleClear = () => {
        setQuery('');
        if (onSearch) onSearch('');
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
                <Search size={20} />
            </div>
            <input
                type="text"
                className="w-full h-12 pl-11 pr-10 rounded-xl border border-border bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary transition-all duration-200"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                {...props}
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-all"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};

export default SearchBar;
