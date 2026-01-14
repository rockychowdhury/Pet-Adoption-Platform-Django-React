import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, Search, Loader2 } from 'lucide-react';
import Input from './Input';

/**
 * LocationSearchInput
 * Uses OpenStreetMap (Nominatim) to search for cities/addresses.
 * Returns { city, state, zip_code, latitude, longitude, display_name }
 */
const LocationSearchInput = ({ onLocationSelect, label = "Location", placeholder = "Search city, state or zip...", required = false }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 3 && showResults) {
                searchLocation(query);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [query]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchLocation = async (searchTerm) => {
        setLoading(true);
        try {
            // Nominatim API (OpenStreetMap)
            // countrycodes=us limits to USA for this app context
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&addressdetails=1&countrycodes=us&limit=5`
            );
            setResults(response.data);
        } catch (error) {
            console.error("Location search failed", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        // Parse address details
        const address = item.address;
        const locationData = {
            city: address.city || address.town || address.village || address.hamlet || '',
            state: address.state || '',
            zip: address.postcode || '',
            latitude: item.lat,
            longitude: item.lon,
            display_name: item.display_name
        };

        setQuery(item.display_name.split(',').slice(0, 3).join(',')); // Shorten display
        setShowResults(false);
        if (onLocationSelect) {
            onLocationSelect(locationData);
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <Input
                    label={label}
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    required={required}
                    icon={MapPin}
                />
                {loading && (
                    <div className="absolute right-3 top-[38px] text-brand-primary animate-spin">
                        <Loader2 size={18} />
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {results.map((item, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-bg-secondary flex items-start gap-3 transition-colors border-b border-border last:border-0"
                            onClick={() => handleSelect(item)}
                        >
                            <MapPin size={16} className="mt-1 text-text-tertiary flex-shrink-0" />
                            <div>
                                <div className="font-medium text-text-primary text-sm">
                                    {item.display_name.split(',')[0]}
                                </div>
                                <div className="text-xs text-text-tertiary">
                                    {item.display_name.split(',').slice(1).join(',').trim()}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationSearchInput;
