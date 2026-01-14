import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { X, Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';

// Fix Leaflet marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const REVERSE_GEOCODE_URL = "https://nominatim.openstreetmap.org/reverse?";

const LocationPickerModal = ({ isOpen, onClose, onSelect, initialLocation, initialRadius = 25 }) => {
    const [position, setPosition] = useState([37.0902, -95.7129]); // Default: USA Center
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [locationName, setLocationName] = useState('Select a location');
    const [isDetecting, setIsDetecting] = useState(false);
    const [radius, setRadius] = useState(initialRadius);

    // Auto-detect location on mount if requested
    useEffect(() => {
        if (isOpen) {
            detectLocation();
        }
    }, [isOpen]);

    // Debounced Search Effect for Autocomplete
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.length >= 3) {
                handleSearch(searchTerm);
            } else {
                // Clear results if user deletes text below 3 chars
                setSearchResults([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const detectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = [latitude, longitude];
                    setPosition(newPos);
                    await reverseGeocode(latitude, longitude);
                    setIsDetecting(false);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setIsDetecting(false);
                }
            );
        } else {
            setIsDetecting(false);
        }
    };

    const reverseGeocode = async (lat, lon) => {
        try {
            const params = {
                lat: lat,
                lon: lon,
                format: "json",
                addressdetails: 1
            };
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${REVERSE_GEOCODE_URL}${queryString}`);
            const data = await response.json();

            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.suburb || '';
                const state = data.address.state || '';
                const name = city && state ? `${city}, ${state}` : data.display_name;
                setLocationName(name);
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
        }
    };

    const handleSearch = async (query = searchTerm) => {
        if (!query || query.length < 3) return;
        setIsSearching(true);
        try {
            const params = {
                q: query,
                format: "json",
                addressdetails: 1,
                limit: 5,
                countrycodes: '' // You could restrict this if needed
            };
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${NOMINATIM_BASE_URL}${queryString}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectSearchResult = (result) => {
        const newPos = [parseFloat(result.lat), parseFloat(result.lon)];
        setPosition(newPos);
        setLocationName(result.display_name);
        setSearchResults([]);
        setSearchTerm(result.display_name.split(',')[0]); // Fill input with city name
    };

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const newPos = [e.latlng.lat, e.latlng.lng];
                setPosition(newPos);
                reverseGeocode(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    const RecenterMap = ({ pos }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(pos);
        }, [pos]);
        return null;
    };

    const handleConfirm = () => {
        onSelect({
            name: locationName,
            lat: position[0],
            lng: position[1],
            radius: radius
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-bg-surface w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-border/10 flex flex-col max-h-[95vh]"
                >
                    {/* Header */}
                    <div className="p-6 sm:p-8 border-b border-border/10 bg-bg-surface/50">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-logo font-black tracking-tight text-text-primary">Where are you looking?</h2>
                            <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full transition-all text-text-tertiary">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.2em]">Select your location for better results</p>
                    </div>

                    {/* Search Section */}
                    <div className="p-6 sm:p-8 space-y-6">
                        <div className="relative">
                            <div className="relative group/search flex items-center bg-bg-secondary/30 border border-border/10 rounded-full p-1 transition-all focus-within:ring-2 focus-within:ring-brand-primary/20">
                                <Search className="text-text-tertiary ml-5 mr-3 shrink-0" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search for a city, area, or zip..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-text-primary placeholder:text-text-tertiary h-12 font-medium"
                                />
                                <button
                                    onClick={() => handleSearch(searchTerm)}
                                    disabled={isSearching}
                                    className="h-10 px-8 bg-brand-primary text-text-inverted rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-brand-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSearching ? <Loader2 size={14} className="animate-spin" /> : 'Search'}
                                </button>
                            </div>

                            {/* Search Results Dropdown - Contained */}
                            <AnimatePresence>
                                {searchResults.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute inset-x-0 top-full mt-2 z-[1100] bg-bg-surface border border-border/10 rounded-[24px] shadow-2xl overflow-hidden"
                                    >
                                        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                                            {searchResults.map((result, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        selectSearchResult(result);
                                                    }}
                                                    className="w-full text-left p-4 hover:bg-brand-primary/5 border-b border-border/5 last:border-0 transition-colors flex items-start gap-4"
                                                >
                                                    <div className="mt-0.5 p-2 bg-bg-secondary/50 rounded-lg">
                                                        <MapPin size={14} className="text-brand-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-primary">{result.display_name.split(',')[0]}</p>
                                                        <p className="text-[10px] text-text-tertiary mt-1 line-clamp-1 font-medium">{result.display_name}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-text-secondary bg-bg-secondary/20 px-4 py-2 rounded-xl border border-border/5 max-w-full overflow-hidden">
                                <div className="p-1.5 bg-brand-primary/10 rounded-lg shrink-0">
                                    <MapPin size={14} className="text-brand-primary" />
                                </div>
                                <span className="text-xs font-bold truncate">
                                    {isDetecting ? 'Detecting...' : (locationName || 'Pick a location')}
                                </span>
                            </div>
                            <button
                                onClick={detectLocation}
                                disabled={isDetecting}
                                className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/20 transition-all disabled:opacity-50"
                                type="button"
                            >
                                {isDetecting ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                                Use Current Location
                            </button>
                        </div>

                        {/* Radius Selector */}
                        <div className="flex flex-col gap-3 pt-2">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Search Radius (miles)</label>
                            <div className="flex items-center gap-3">
                                {[10, 25, 50, 100, 250].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setRadius(val)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${radius === val
                                            ? 'bg-brand-primary text-white shadow-md'
                                            : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
                                            }`}
                                    >
                                        {val} mi
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="relative h-[300px] border-y border-border/5">
                        <MapContainer
                            center={position}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={position} />
                            <MapEvents />
                            <RecenterMap pos={position} />
                        </MapContainer>

                        {/* Map Gradient Overlays */}
                        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-bg-surface/80 to-transparent pointer-events-none z-[401]"></div>
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg-surface/80 to-transparent pointer-events-none z-[401]"></div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 sm:p-8 bg-bg-surface border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
                            <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">
                                Tap map to manually pick location
                            </p>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 sm:flex-none px-10 py-4 rounded-full border border-border/20 text-text-secondary text-[11px] font-black uppercase tracking-widest hover:bg-bg-secondary transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="flex-1 sm:flex-none px-12 py-4 bg-brand-primary text-text-inverted rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LocationPickerModal;
