/**
 * Get the appropriate redirect path based on user role
 * @param {Object} user - User object with role property
 * @param {string} fallback - Fallback path if no specific role redirect
 * @returns {string} - Redirect path
 */
export const getRoleBasedRedirect = (user, fallback = '/dashboard') => {
    if (!user) return fallback;

    switch (user.role) {
        case 'admin':
            return '/admin';
        case 'service_provider':
            return '/provider/dashboard';
        default:
            return '/dashboard';
    }
};
