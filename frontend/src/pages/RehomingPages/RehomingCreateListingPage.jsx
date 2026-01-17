import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Upload, AlertTriangle, Dog, Cat, Bird, Info, Camera, X, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Form/Input';
import Checkbox from '../../components/common/Form/Checkbox';
import LocationSearchInput from '../../components/common/Form/LocationSearchInput';

import useRehoming from '../../hooks/useRehoming';
import usePets from '../../hooks/usePets';
import useAuth from '../../hooks/useAuth';
import useAPI from '../../hooks/useAPI';
import useImgBB from '../../hooks/useImgBB'; // Import useImgBB

const RehomingCreateListingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const { user } = useAuth();

    // Hooks
    const { useGetRehomingRequests, useCreateListing, useUpdateListing, useGetListingDetail } = useRehoming();
    const { useGetUserPets, useCreatePet, useUpdatePet } = usePets();

    const createListing = useCreateListing();
    const updateListing = useUpdateListing();
    const createPet = useCreatePet();
    const updatePet = useUpdatePet();
    const { uploadImage, uploading: isUploadingPhoto } = useImgBB();

    // Data Fetching
    const { data: requestsData, isLoading: isCheckingRequests } = useGetRehomingRequests();
    // Prefer requestId from navigation state, else fallback to latest confirmed
    const navRequestId = location.state?.requestId;

    // Handle pagination or flat array
    const requests = Array.isArray(requestsData) ? requestsData : (requestsData?.results || []);

    // Resolve the active request
    const rehomingRequest = navRequestId
        ? requests.find(r => r.id === navRequestId)
        : requests.find(r => r.status === 'confirmed');

    const { data: existingListing } = useGetListingDetail(editId);

    // State
    const [currentStep, setCurrentStep] = useState(1); // Start at Basics (Step 1)

    // Form Data
    const [formData, setFormData] = useState({
        // Pet Details
        pet_name: '', species: 'dog', breed: '', age: '', gender: 'male', size_category: 'medium',

        // Medical
        spayed: 'yes', microchip: 'yes', vaccinations: 'yes',
        medications: '', conditions: [],

        // Behavioral
        energy: 3, affection: 5,
        good_with_kids: 'unknown', good_with_dogs: 'unknown', good_with_cats: 'unknown',
        house_trained: 'yes', crate_trained: 'no', separation_anxiety: 'no', exercise_needs: 'moderate',
        aggression_person: 'no', aggression_animal: 'no', aggression_details: '',

        // Story & Media
        story: '', photos: [], video_url: '',

        // Location
        location_city: '', location_state: '', location_zip: '', location_lat: null, location_lon: null,

        // Terms
        included_items: [], timeline: '', experience: 'any',
        stay_in_touch: 'yes', return_policy: 'yes'
    });

    // Populate Form on Edit
    useEffect(() => {
        if (existingListing) {
            setFormData({
                pet_name: existingListing.pet_name || '',
                species: existingListing.species || 'dog',
                breed: existingListing.breed || '',
                age: existingListing.age || '',
                gender: existingListing.gender || 'male',
                size_category: existingListing.size_category || 'medium',

                spayed: existingListing.medical_history?.spayed_neutered ? 'yes' : 'no',
                microchip: existingListing.medical_history?.microchipped ? 'yes' : 'no',
                vaccinations: existingListing.medical_history?.vaccinations_current ? 'yes' : 'no',
                medications: existingListing.medical_history?.current_medications?.join(', ') || '',
                conditions: existingListing.medical_history?.medical_conditions || [],

                energy: existingListing.behavioral_profile?.energy_level || 3,
                affection: existingListing.behavioral_profile?.affection_level || 5,
                good_with_kids: existingListing.behavioral_profile?.good_with_children ? 'yes' : 'no',
                good_with_dogs: existingListing.behavioral_profile?.good_with_dogs ? 'yes' : 'no',
                good_with_cats: existingListing.behavioral_profile?.good_with_cats ? 'yes' : 'no',
                house_trained: existingListing.behavioral_profile?.house_trained ? 'yes' : 'no',
                crate_trained: existingListing.behavioral_profile?.crate_trained ? 'yes' : 'no',
                separation_anxiety: existingListing.behavioral_profile?.separation_anxiety ? 'yes' : 'no',
                exercise_needs: existingListing.behavioral_profile?.exercise_needs || 'moderate',
                aggression_person: existingListing.behavioral_profile?.aggression_history?.bitten_person ? 'yes' : 'no',
                aggression_animal: existingListing.behavioral_profile?.aggression_history?.bitten_animal ? 'yes' : 'no',
                aggression_details: existingListing.aggression_details || '',

                story: existingListing.rehoming_story || '',
                photos: existingListing.photos || [],
                video_url: existingListing.video_url || '',

                location_city: existingListing.location_city || '',
                location_state: existingListing.location_state || '',
                location_zip: existingListing.location_zip || '',
                location_lat: existingListing.latitude,
                location_lon: existingListing.longitude,

                included_items: existingListing.included_items || [],
                timeline: existingListing.ideal_adoption_date || '',
                stay_in_touch: existingListing.custom_questions?.stay_in_touch ? 'yes' : 'no',
                return_policy: existingListing.custom_questions?.return_policy ? 'yes' : 'no'
            });
            setCurrentStep(1);
        }
    }, [existingListing]);

    // Request Validation & Auto-Populate
    useEffect(() => {
        // If editing, skip request checks
        if (editId || existingListing) return;

        if (!isCheckingRequests) {
            if (!rehomingRequest) {
                toast.info("Please start a rehoming request first.");
                navigate('/rehoming');
                return;
            }

            if (rehomingRequest.status === 'cooling_period') {
                toast.info("Your request is in the cooling period.");
                navigate('/rehoming/status');
                return;
            }

            if (rehomingRequest.status !== 'confirmed') {
                toast.error("Invalid request status.");
                navigate('/rehoming');
                return;
            }

            // Valid Confirmed Request -> Populate
            const pet = rehomingRequest.pet_details;
            if (pet) {
                // Only populate if form is empty (prevent overwrite on re-renders)
                setFormData(prev => {
                    if (prev.pet_name) return prev; // Already populated

                    toast.info(`Continuing listing for ${pet.name}`);
                    return {
                        ...prev,
                        pet_name: pet.name,
                        species: pet.species,
                        breed: pet.breed || '',
                        age: pet.age || '',
                        gender: pet.gender || 'unknown',
                        photos: pet.photos || [], // Now includes gallery from backend updates
                        story: rehomingRequest.reason || '',
                        location_city: rehomingRequest.location_city || user?.location_city || '',
                        location_state: rehomingRequest.location_state || user?.location_state || '',
                    };
                });
            }
        }
    }, [rehomingRequest, isCheckingRequests, navigate, editId, existingListing, user]);

    // Helper to map urgency
    const mapUrgency = (u) => {
        if (!u) return 'flexible';
        if (u === 'one_month') return '1_month';
        if (u === 'three_months') return '3_months';
        return u; // immediate, flexible match
    };


    const STEPS = [
        { id: 1, title: 'Basics' },
        { id: 2, title: 'Location' },
        { id: 3, title: 'Medical' },
        { id: 4, title: 'Behavior' },
        { id: 5, title: 'Story & Media' },
        { id: 6, title: 'Terms' },
        { id: 7, title: 'Review' }
    ];

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Optimistic UI or Loading Toast
        const toastId = toast.loading("Uploading photos...");

        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);

            const validPhotos = results
                .filter(res => res && res.success)
                .map(res => ({ url: res.url, delete_url: res.delete_url }));

            if (validPhotos.length > 0) {
                setFormData(prev => ({ ...prev, photos: [...prev.photos, ...validPhotos] }));
                toast.update(toastId, { render: `Uploaded ${validPhotos.length} photos successfully!`, type: "success", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: "Failed to upload photos. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.update(toastId, { render: "Upload error occurred.", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleLocationSelect = (loc) => {
        setFormData(prev => ({
            ...prev,
            location_city: loc.city,
            location_state: loc.state,
            location_zip: loc.zip,
            location_lat: loc.latitude,
            location_lon: loc.longitude
        }));
    };

    const handleSubmit = async () => {
        // 1. Prepare Pet Payload
        const traits = [];
        if (formData.good_with_kids === 'yes') traits.push('Good with Kids');
        if (formData.good_with_dogs === 'yes') traits.push('Good with Dogs');
        if (formData.good_with_cats === 'yes') traits.push('Good with Cats');
        if (parseInt(formData.energy) >= 4) traits.push('Energetic');
        else if (parseInt(formData.energy) <= 2) traits.push('Calm');
        if (parseInt(formData.affection) >= 4) traits.push('Affectionate');
        else if (parseInt(formData.affection) <= 2) traits.push('Independent');
        if (formData.house_trained === 'yes') traits.push('House Trained');

        const birthDate = formData.age ? new Date(new Date().setFullYear(new Date().getFullYear() - parseInt(formData.age))).toISOString().split('T')[0] : null;

        const petPayload = {
            name: formData.pet_name,
            species: formData.species,
            breed: formData.breed,
            birth_date: birthDate,
            gender: formData.gender,
            size_category: formData.size_category,
            description: formData.story,
            media_data: formData.photos,
            traits: traits,
            spayed_neutered: formData.spayed === 'yes',
            microchipped: formData.microchip === 'yes',
            status: 'active'
        };

        // Basic Validation
        if (!petPayload.name || !petPayload.species) {
            toast.error("Pet Name and Species are required.");
            return;
        }
        if (formData.location_city === '') {
            toast.error("Please select a location.");
            return;
        }

        try {
            // New Flow: Core Logic uses rehomingRequest
            if (!rehomingRequest && !editId) {
                toast.error("Missing rehoming request context.");
                return;
            }

            // Step 1: Update Pet (Always update the pet from the request)
            const petId = rehomingRequest?.pet || existingListing?.pet?.id;
            await updatePet.mutateAsync({ id: petId, data: petPayload });

            // Step 2: Create/Update Listing
            const listingPayload = {
                request_id: rehomingRequest?.id, // CRITICAL: Send request_id for backend link
                reason: formData.story,
                urgency: mapUrgency(rehomingRequest?.urgency),
                location_city: formData.location_city,
                location_state: formData.location_state,
                location_zip: formData.location_zip,
                latitude: formData.location_lat ? parseFloat(formData.location_lat).toFixed(6) : null,
                longitude: formData.location_lon ? parseFloat(formData.location_lon).toFixed(6) : null,
                ideal_home_notes: `Timeline: ${formData.timeline || 'Flexible'}. Included: ${formData.included_items.join(', ')}.`,
                status: 'active'
            };

            if (existingListing) {
                await updateListing.mutateAsync({ id: editId, data: listingPayload });
                toast.success("Listing updated successfully!");
            } else {
                await createListing.mutateAsync(listingPayload);
                toast.success("Listing submitted successfully!");
            }
            navigate('/dashboard/rehoming');

        } catch (error) {
            console.error("Submission failed", error);
            const msg = error?.response?.data?.message || "Failed to submit listing.";
            toast.error(msg);
        }
    };

    const renderBasics = () => (
        <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold">Pet Basics</h2>
            <Input label="Pet Name" name="pet_name" value={formData.pet_name} onChange={handleInputChange} required />

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary">Species</label>
                    <select name="species" value={formData.species} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none">
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="bird">Bird</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <Input label="Breed" name="breed" value={formData.breed} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input type="number" label="Age (Years)" name="age" value={formData.age} onChange={handleInputChange} />
                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-bold text-text-primary">Size Category</label>
                <select name="size_category" value={formData.size_category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none">
                    <option value="xs">XS (Teacup/Kitten)</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xl">XL (Giant)</option>
                </select>
            </div>
        </Card>
    );

    const renderLocation = () => (
        <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold">Location</h2>
            <p className="text-sm text-text-secondary">Where is the pet currently located?</p>

            <LocationSearchInput
                onLocationSelect={handleLocationSelect}
                required
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-bg-secondary/50 p-4 rounded-xl">
                <div className="col-span-1 md:col-span-3 text-xs font-bold text-text-tertiary uppercase">Selected Location</div>
                <div>
                    <label className="block text-xs text-text-secondary">City</label>
                    <div className="font-medium">{formData.location_city || '-'}</div>
                </div>
                <div>
                    <label className="block text-xs text-text-secondary">State</label>
                    <div className="font-medium">{formData.location_state || '-'}</div>
                </div>
                <div>
                    <label className="block text-xs text-text-secondary">Zip</label>
                    <div className="font-medium">{formData.location_zip || '-'}</div>
                </div>
            </div>
        </Card>
    );

    const renderMedical = () => (
        <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold">Medical History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['spayed', 'microchip', 'vaccinations'].map(field => (
                    <div key={field}>
                        <label className="block text-sm font-bold text-text-primary mb-2 capitalize">{field.replace('_', ' ')}?</label>
                        <select name={field} value={formData[field]} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-border bg-bg-surface outline-none">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                ))}
            </div>
            <Input label="Current Medications (comma separated)" name="medications" value={formData.medications} onChange={handleInputChange} placeholder="e.g. Heartgard, Insulin" />
        </Card>
    );

    const renderBehavior = () => (
        <Card className="p-8 space-y-8">
            <h2 className="text-xl font-bold">Behavioral Profile</h2>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="flex justify-between text-sm font-bold text-text-primary">
                        <span>Energy Level</span>
                        <span className="text-brand-primary">{formData.energy}/5</span>
                    </label>
                    <input type="range" min="1" max="5" name="energy" value={formData.energy} onChange={handleInputChange} className="w-full accent-brand-primary" />
                    <div className="flex justify-between text-xs text-text-tertiary"><span>Lazy</span><span>Energetic</span></div>
                </div>
                <div className="space-y-2">
                    <label className="flex justify-between text-sm font-bold text-text-primary">
                        <span>Affection Level</span>
                        <span className="text-brand-primary">{formData.affection}/5</span>
                    </label>
                    <input type="range" min="1" max="5" name="affection" value={formData.affection} onChange={handleInputChange} className="w-full accent-brand-primary" />
                    <div className="flex justify-between text-xs text-text-tertiary"><span>Independent</span><span>Cuddly</span></div>
                </div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['good_with_kids', 'good_with_dogs', 'good_with_cats'].map(field => (
                    <div key={field}>
                        <label className="block text-sm font-bold text-text-primary mb-2 capitalize">{field.replace(/_/g, ' ')}</label>
                        <select name={field} value={formData[field]} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-border bg-bg-surface outline-none">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                ))}
            </div>

            {/* Training */}
            <div className="grid grid-cols-2 gap-4">
                {['house_trained', 'crate_trained', 'separation_anxiety'].map(field => (
                    <div key={field}>
                        <label className="block text-sm font-bold text-text-primary mb-2 capitalize">{field.replace('_', ' ')}?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2"><input type="radio" name={field} value="yes" checked={formData[field] === 'yes'} onChange={handleInputChange} /> Yes</label>
                            <label className="flex items-center gap-2"><input type="radio" name={field} value="no" checked={formData[field] === 'no'} onChange={handleInputChange} /> No</label>
                        </div>
                    </div>
                ))}
            </div>

            {/* Aggression - Critical */}
            <div className="bg-status-warning/10 border border-status-warning/20 p-4 rounded-xl space-y-4">
                <div className="flex items-center gap-2 font-bold text-status-warning">
                    <AlertTriangle size={18} /> Aggression History
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Has bitten a person?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2"><input type="radio" name="aggression_person" value="yes" checked={formData.aggression_person === 'yes'} onChange={handleInputChange} className="text-status-error focus:ring-status-error" /> Yes</label>
                            <label className="flex items-center gap-2"><input type="radio" name="aggression_person" value="no" checked={formData.aggression_person === 'no'} onChange={handleInputChange} /> No</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Has bitten an animal?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2"><input type="radio" name="aggression_animal" value="yes" checked={formData.aggression_animal === 'yes'} onChange={handleInputChange} className="text-status-error focus:ring-status-error" /> Yes</label>
                            <label className="flex items-center gap-2"><input type="radio" name="aggression_animal" value="no" checked={formData.aggression_animal === 'no'} onChange={handleInputChange} /> No</label>
                        </div>
                    </div>
                </div>
                {(formData.aggression_person === 'yes' || formData.aggression_animal === 'yes') && (
                    <Input label="Please provide details (Required)" name="aggression_details" value={formData.aggression_details} onChange={handleInputChange} required />
                )}
            </div>
        </Card>
    );

    const renderMedia = () => (
        <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold">Story & Media</h2>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Rehoming Story</label>
                <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleInputChange}
                    className="w-full h-40 px-4 py-3 rounded-xl border border-border bg-bg-surface focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                    placeholder="Tell us about their personality, history, and why they need a new home..."
                ></textarea>
                <p className="text-xs text-text-tertiary text-right">{formData.story.length} chars (min 200 recommended)</p>
            </div>

            <Input label="Video URL (YouTube/Vimeo)" name="video_url" value={formData.video_url} onChange={handleInputChange} placeholder="https://..." />

            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Photos (Min 5 recommended)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                            <img src={photo.url} className="w-full h-full object-cover" alt="Upload" />
                            <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));
                            }}>
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer flex flex-col items-center justify-center transition-colors">
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        <Camera className="text-text-tertiary mb-2" />
                        <span className="text-xs font-bold text-text-secondary">{isUploadingPhoto ? 'Uploading...' : 'Add Photo'}</span>
                    </label>
                </div>
            </div>
        </Card>
    );

    const renderTerms = () => (
        <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold">Adoption Terms</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input type="date" label="Ideal Adoption By" name="timeline" value={formData.timeline} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Included Items</label>
                <div className="grid grid-cols-2 gap-2">
                    {['Crate', 'Leash & Collar', 'Food', 'Toys', 'Bed', 'Medical Records'].map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            checked={formData.included_items.includes(item)}
                            onChange={() => {
                                setFormData(prev => ({
                                    ...prev,
                                    included_items: prev.included_items.includes(item)
                                        ? prev.included_items.filter(i => i !== item)
                                        : [...prev.included_items, item]
                                }));
                            }}
                        />
                    ))}
                </div>
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
                <h3 className="font-bold text-text-primary">Your Preferences</h3>
                <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 border rounded-xl">
                        <span className="text-sm">Are you willing to stay in touch with adopters?</span>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2"><input type="radio" name="stay_in_touch" value="yes" checked={formData.stay_in_touch === 'yes'} onChange={handleInputChange} /> Yes</label>
                            <label className="flex items-center gap-2"><input type="radio" name="stay_in_touch" value="no" checked={formData.stay_in_touch === 'no'} onChange={handleInputChange} /> No</label>
                        </div>
                    </label>
                    <label className="flex items-center justify-between p-3 border rounded-xl">
                        <span className="text-sm">Will you take the pet back if it doesn't work out?</span>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2"><input type="radio" name="return_policy" value="yes" checked={formData.return_policy === 'yes'} onChange={handleInputChange} /> Yes</label>
                            <label className="flex items-center gap-2"><input type="radio" name="return_policy" value="no" checked={formData.return_policy === 'no'} onChange={handleInputChange} /> No</label>
                        </div>
                    </label>
                </div>
            </div>
        </Card>
    );

    const renderReview = () => (
        <div className="space-y-6">
            <Card className="p-8 text-center bg-status-success/10 border-status-success/20">
                <div className="w-16 h-16 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-4 text-status-success">
                    <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold text-status-success mb-2">Ready to Submit?</h2>
                <p className="text-status-success">Your listing for <strong>{formData.pet_name || 'your pet'}</strong> is ready for review.</p>
            </Card>

            <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="p-4 bg-bg-surface rounded-xl border">
                    <div className="font-bold text-text-tertiary mb-1">Location</div>
                    <div>{formData.location_city}, {formData.location_state}</div>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-bg-surface rounded-xl border border-border">
                <Checkbox checked readOnly />
                <span className="text-xs font-bold text-text-primary">I verify that all information is accurate and honest to the best of my knowledge.</span>
            </div>
        </div>
    );

    if (isCheckingRequests) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-bg-primary pb-20">
            {/* Sticky Header with Progress */}
            {currentStep > 0 && (
                <div className="sticky top-0 z-30 bg-bg-surface/80 backdrop-blur-md border-b border-border shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center h-16 min-w-max">
                            {STEPS.map((step) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${currentStep === step.id ? 'bg-brand-primary text-text-inverted font-bold' : currentStep > step.id ? 'text-status-success font-bold' : 'text-text-tertiary'}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${currentStep === step.id ? 'border-text-inverted' : currentStep > step.id ? 'border-status-success bg-status-success text-text-inverted' : 'border-current'}`}>
                                            {currentStep > step.id ? <Check size={12} /> : step.id}
                                        </div>
                                        <span>{step.title}</span>
                                    </div>
                                    {step.id < STEPS.length && <div className="w-8 h-px bg-border mx-2"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 py-8">
                {currentStep > 0 && (
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="mb-8">
                            {currentStep === 1 && renderBasics()}
                            {currentStep === 2 && renderLocation()}
                            {currentStep === 3 && renderMedical()}
                            {currentStep === 4 && renderBehavior()}
                            {currentStep === 5 && renderMedia()}
                            {currentStep === 6 && renderTerms()}
                            {currentStep === 7 && renderReview()}
                        </div>

                        <div className="flex justify-between pt-6 border-t border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                            >
                                <ChevronLeft size={18} className="mr-2" /> Back
                            </Button>

                            <div className="flex gap-4">
                                {currentStep < STEPS.length ? (
                                    <Button type="button" variant="primary" onClick={nextStep}>
                                        Next: {STEPS[currentStep].title} <ChevronRight size={18} className="ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleSubmit}
                                        disabled={createListing.isPending || updateListing.isPending}
                                    >
                                        {(createListing.isPending || updateListing.isPending) ? 'Submitting...' : 'Submit Listing'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RehomingCreateListingPage;
