import React, { useState } from 'react';
import { X, Calendar, PawPrint, CheckCircle, AlertCircle, Loader } from 'lucide-react';
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
    const [selectedPet, setSelectedPet] = useState(null);
    const [notes, setNotes] = useState('');

    const { useCreateBooking } = useServices();
    const createBooking = useCreateBooking();

    const { useGetMyPets } = usePets();
    const { data: myPets, isLoading: petsLoading } = useGetMyPets();

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!selectedPet || !provider) return;

        try {
            await createBooking.mutateAsync({
                provider: provider.id,
                pet: selectedPet.id,
                service_details: {
                    service_name: initialService?.name || 'General Service',
                    price: initialService?.price || provider.price || 0
                },
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                notes: notes
            });
            toast.success('Booking request sent!');
            onClose();
            setStep(1); // Reset
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
                                    <Calendar className="text-brand-primary" size={20} /> Select Dates
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date</label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            className="w-full p-2 border rounded-lg"
                                            minDate={new Date()}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Date</label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                                <textarea
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
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
                                        <span className="text-gray-600">Dates:</span>
                                        <span className="font-bold">{format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}</span>
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
