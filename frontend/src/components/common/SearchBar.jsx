import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Compass } from 'lucide-react';
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
        // Debounce search while typing
        const timer = setTimeout(() => {
            // Avoid triggering search on initial mount or if search hasn't changed from props
            if (searchText !== initialSearch) {
                onSearch({ search: searchText, location: locationName, radius });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText, initialSearch, locationName, radius, onSearch]);

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

        // Immediate search update when location changes
        onSearch({
            search: searchText,
            location: loc.name,
            radius: loc.radius || radius
        });
    };

    return (
        <div className="flex items-center w-full max-w-[850px] bg-white rounded-[20px] px-2 py-1 shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-brand-primary/5 relative z-30">

            {/* 1. Keyword Input (Left) */}
            <div className="flex-1 flex items-center gap-4 px-4 py-2.5 rounded-l-[16px] group">
                <Search size={22} className="text-gray-400 shrink-0 stroke-[2.5]" />
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none focus:ring-0 text-[15px] font-semibold text-text-primary placeholder:text-gray-400 p-0"
                />
            </div>

            {/* 2. Right Actions Container */}
            <div className="flex items-center gap-2">

                {/* Location/Radius Pill (Conditional) */}
                {showLocation && (
                    <button
                        onClick={() => setIsLocationModalOpen(true)}
                        className="flex items-center gap-2 pl-2 pr-4 py-1 my-0 bg-bg-secondary hover:bg-gray-50 text-[#1F2937] rounded-full transition-all font-bold text-[13px] group shadow-sm shrink-0 hover:ring-2 hover:ring-brand-primary/5"
                        title={locationName || "Select Location"}
                    >
                        <div className="w-8 h-8 flex items-center justify-center bg-brand-primary/10 rounded-full text-brand-primary group-hover:bg-brand-primary/20 transition-colors">
                            <MapPin size={14} strokeWidth={2.5} />
                        </div>
                        <span>{radius} mi</span>
                    </button>
                )}

                {/* Search Button */}
                <button
                    onClick={handleSearchClick}
                    className="px-8 py-3 bg-[#2D5A41] text-white rounded-[14px] font-bold text-[14px] hover:bg-[#234532] active:scale-95 transition-all shrink-0"
                >
                    Search
                </button>
            </div>

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
