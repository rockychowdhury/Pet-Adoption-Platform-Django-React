export const calculateCompletion = (values) => {
    let completed = 0;
    const missing = [];

    // Basic Fields
    if (values.pet_name) completed++; else missing.push('Name');
    if (values.species) completed++; else missing.push('Species');
    if (values.breed) completed++; else missing.push('Breed');
    if (values.gender && values.gender !== 'unknown') completed++; else missing.push('Gender');
    if (values.rehoming_story) completed++; else missing.push('Bio/Story');

    // Complex Checks
    if (values.birth_date) completed++; else missing.push('Birth Date');

    // Photos (Require 3)
    const photoCount = values.photos ? values.photos.length : 0;
    if (photoCount >= 3) {
        completed++;
    } else {
        missing.push(`Photos (${photoCount}/3)`);
    }

    // Traits (Require 2)
    const traitCount = values.personality_traits ? values.personality_traits.length : 0;
    if (traitCount >= 2) {
        completed++;
    } else {
        missing.push(`Personality Traits (${traitCount}/2)`);
    }

    return { score: completed, total: 8, missing };
};
