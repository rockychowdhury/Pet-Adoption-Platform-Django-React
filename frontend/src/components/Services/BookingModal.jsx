import React, { useState } from 'react';
import { X, Calendar, PawPrint, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import useServices from '../../hooks/useServices';
import usePets from '../../hooks/usePets';
import Button from '../../components/common/Buttons/Button';
import { toast } from 'react-toastify';

const BookingModal = ({ isOpen, onClose, provider, initialService }) => {
    const [step, setStep] = useState(1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('09:00'); // Default time
    const [selectedPet, setSelectedPet] = useState(null);
    const [notes, setNotes] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    const { useCreateBooking } = useServices();
    const createBooking = useCreateBooking();

    const { useGetMyPets } = usePets();
    const { data: myPets, isLoading: petsLoading } = useGetMyPets();

    // Fetch availability when date changes
    const fetchAvailability = async (date) => {
        if (!provider || !date) return;

        setLoadingAvailability(true);
        try {
            const response = await fetch('/api/services/bookings/check_availability/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    provider_id: provider.id,
                    date: format(date, 'yyyy-MM-dd')
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAvailableSlots(data.available_slots || []);
                // Set first available slot as default
                const firstAvailable = data.available_slots?.find(slot => slot.available);
                if (firstAvailable) {
                    setSelectedTime(firstAvailable.time);
                }
            }
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            toast.error('Could not load available times');
        } finally {
            setLoadingAvailability(false);
        }
    };

    // Fetch availability when date changes and it's an appointment
    React.useEffect(() => {
        if (isAppointment && startDate && isOpen) {
            fetchAvailability(startDate);
        }
    }, [startDate, isAppointment, isOpen]);

    // Determine booking type logic
    const getBookingType = () => {
        if (!provider) return 'range';

        // Check specifics first
        if (provider.vet_details) return 'appointment';
        if (provider.groomer_details) return 'appointment';
        if (provider.foster_details) return 'range';

        // Check service name if passed
        if (initialService) {
            const name = initialService.name?.toLowerCase() || '';
            if (name.includes('walk') || name.includes('visit') || name.includes('groom') || name.includes('consultation')) return 'appointment';
            if (name.includes('sitting') || name.includes('boarding')) return 'range';
        }

        // Fallback to category check
        const catName = provider.category?.name?.toLowerCase() || '';
        const catSlug = provider.category?.slug?.toLowerCase() || '';

        if (catSlug === 'veterinary' || catName.includes('vet')) return 'appointment';
        if (catSlug === 'training' || catName.includes('train')) return 'appointment';
        if (catSlug === 'groomer' || catName.includes('groom')) return 'appointment';
        if (catSlug === 'walking' || catName.includes('walking')) return 'appointment';

        return 'range'; // Default for Sitting, Foster, etc.
    };

    const isAppointment = getBookingType() === 'appointment';

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!selectedPet || !provider) return;

        try {
            // Combine Date + Time for Start Date if appointment
            let finalStart = new Date(startDate);
            let finalEnd = new Date(endDate);

            if (isAppointment) {
                const [hours, minutes] = selectedTime.split(':');
                finalStart.setHours(parseInt(hours), parseInt(minutes));
                finalEnd = new Date(finalStart);
                finalEnd.setHours(finalStart.getHours() + 1); // Default 1 hour duration
            }

            const response = await createBooking.mutateAsync({
                provider: provider.id,
                pet: selectedPet.id,
                service_option: initialService?.id || null,
                booking_type: isAppointment ? 'standard' : 'recurring',
                booking_date: finalStart.toISOString().split('T')[0], // YYYY-MM-DD
                booking_time: isAppointment ? selectedTime : null,
                start_datetime: finalStart.toISOString(),
                end_datetime: finalEnd.toISOString(),
                special_requirements: notes
            });

            // Redirect to payment checkout
            toast.success('Booking created! Redirecting to checkout...');
            onClose();
            setStep(1); // Reset

            // Use window.location to navigate (or pass navigate if available)
            window.location.href = `/checkout/${response.id}`;
        } catch (error) {
            console.error(error);
            toast.error('Failed to create booking.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold font-merriweather">
                        Book {provider?.business_name}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                    <Calendar className="text-brand-primary" size={20} /> Select Date & Time
                                </h3>

                                <div className="space-y-4">
                                    {/* Date Picker */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                                {isAppointment ? 'Date' : 'Start Date'}
                                            </label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => {
                                                    setStartDate(date);
                                                    if (isAppointment) setEndDate(date); // For appointments, end date is same day usually
                                                }}
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                className="w-full p-2 border border-border rounded-lg"
                                                minDate={new Date()}
                                            />
                                        </div>
                                        {!isAppointment && (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Date</label>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={(date) => setEndDate(date)}
                                                    selectsEnd
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    minDate={startDate}
                                                    className="w-full p-2 border border-border rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Time Slot Picker (Only for appointments) */}
                                    {isAppointment && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                                Preferred Time
                                                {loadingAvailability && <span className="ml-2 text-xs font-normal text-gray-400">(Loading...)</span>}
                                            </label>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                                                {availableSlots.length > 0 ? (
                                                    availableSlots.map((slot) => (
                                                        <button
                                                            key={slot.time}
                                                            onClick={() => setSelectedTime(slot.time)}
                                                            disabled={!slot.available}
                                                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${selectedTime === slot.time
                                                                ? 'bg-brand-primary text-white border-brand-primary'
                                                                : slot.available
                                                                    ? 'bg-white text-gray-700 border-gray-200 hover:border-brand-primary/50'
                                                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                                                                }`}
                                                        >
                                                            {slot.time}
                                                            {!slot.available && <span className="text-[10px] block">Booked</span>}
                                                        </button>
                                                    ))
                                                ) : (
                                                    // Fallback to default times if no availability data
                                                    ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                                                        <button
                                                            key={time}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${selectedTime === time
                                                                ? 'bg-brand-primary text-white border-brand-primary'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:border-brand-primary/50'}`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                                <textarea
                                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                                    rows={3}
                                    placeholder="Any special instructions or questions?..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <PawPrint className="text-brand-primary" size={20} /> Select Pet
                            </h3>

                            {petsLoading ? (
                                <div className="flex justify-center py-8"><Loader className="animate-spin" /></div>
                            ) : myPets?.results?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {myPets.results.map(pet => (
                                        <div
                                            key={pet.id}
                                            onClick={() => setSelectedPet(pet)}
                                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${selectedPet?.id === pet.id ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' : 'border-gray-200 hover:border-brand-primary/50'}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                {pet.images?.[0]?.image ? (
                                                    <img src={pet.images[0].image} alt={pet.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><PawPrint size={16} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{pet.name}</p>
                                                <p className="text-xs text-gray-500">{pet.species}</p>
                                            </div>
                                            {selectedPet?.id === pet.id && <CheckCircle className="ml-auto text-brand-primary" size={18} />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl">
                                    <p className="text-gray-500 mb-2">You don't have any pets profiled yet.</p>
                                    <Button variant="outline" size="sm" onClick={() => window.open('/pets/add', '_blank')}>Add a Pet</Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10">
                                <h3 className="font-bold text-lg mb-4 text-brand-primary">Confirm Booking</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Provider:</span>
                                        <span className="font-bold">{provider.business_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Service:</span>
                                        <span className="font-bold">{initialService?.name || 'General Service'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">When:</span>
                                        <span className="font-bold text-right">
                                            {format(startDate, 'MMM dd, yyyy')}
                                            {isAppointment && <span className="block text-brand-primary">{selectedTime}</span>}
                                            {!isAppointment && <> - {format(endDate, 'MMM dd')}</>}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">For:</span>
                                        <span className="font-bold">{selectedPet?.name} <span className="text-xs font-normal text-gray-500">({selectedPet?.species})</span></span>
                                    </div>
                                </div>
                            </div>

                            {createBooking.isError && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                    <AlertCircle size={16} />
                                    <span>Failed to create booking. Please try again.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-between">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={handleBack}>Back</Button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            disabled={step === 2 && !selectedPet}
                        >
                            Next <ArrowRight size={16} className="ml-2" />
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={createBooking.isPending}
                        >
                            {createBooking.isPending ? 'Confirming...' : 'Confirm Booking'}
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BookingModal;
