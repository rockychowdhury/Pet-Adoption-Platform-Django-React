import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import LocationPickerModal from '../Pet/LocationPickerModal';

const SearchBar = ({
    onSearch,
    placeholder = "Search by breed, name...",
    showLocation = true,
    initialSearch = '',
    initialLocation = '',
    initialRadius = 25
}) => {
    const [searchText, setSearchText] = useState(initialSearch);
    const [locationName, setLocationName] = useState(initialLocation);
    const [radius, setRadius] = useState(initialRadius);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchText !== initialSearch) {
                onSearch({ search: searchText, location: locationName, radius });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchText, locationName, radius, onSearch, initialSearch]);

    const handleSearchClick = () => {
        onSearch({ search: searchText, location: locationName, radius });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleLocationSelect = (loc) => {
        setLocationName(loc.name);
        setRadius(loc.radius || radius);
        onSearch({
            search: searchText,
            location: loc.name,
            radius: loc.radius || radius
        });
    };

    return (
        <div className="flex items-center w-full max-w-[450px] bg-bg-secondary/50 rounded-full px-5 py-2 hover:bg-bg-secondary transition-all focus-within:ring-0 focus-within:bg-bg-secondary group border border-transparent">
            <Search size={18} className="text-text-tertiary shrink-0" />
            <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="w-full bg-transparent border-none focus:ring-0 text-[13px] font-medium text-text-primary placeholder:text-text-tertiary px-4 py-1"
            />
            {showLocation && (
                <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-bg-surface border border-border rounded-full text-text-primary transition-all font-bold text-[10px] shadow-sm hover:shadow-md shrink-0"
                >
                    <MapPin size={12} className="text-brand-primary" />
                    <span>{locationName || "Anywhere"}</span>
                </button>
            )}

            <LocationPickerModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSelect={handleLocationSelect}
                initialLocation={locationName}
                initialRadius={radius}
            />
        </div>
    );
};

export default SearchBar;
