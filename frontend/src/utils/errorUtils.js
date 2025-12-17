/**
 * Extracts a user-friendly error message from an error object (axios/DRF).
 * @param {Error} error - The error object caught in try/catch block.
 * @param {string} defaultMessage - Fallback message if extraction fails.
 * @returns {string} The extracted error message.
 */
export const extractErrorMessage = (error, defaultMessage = "Something went wrong.") => {
    if (!error) return defaultMessage;

    // 1. Check for DRF "detail" key (standard exceptions)
    if (error.response?.data?.detail) {
        return error.response.data.detail;
    }

    // 2. Check for DRF "error" key (sometimes used custom)
    if (error.response?.data?.error) {
        return error.response.data.error;
    }

    // 3. Check for specific field validation errors ( { field: ["error"] } )
    // We try to join the first error of each field, or just the first one found.
    if (error.response?.data && typeof error.response.data === 'object') {
        const data = error.response.data;
        // Collect messages from values assuming they are arrays of strings (DRF standard)
        const messages = [];
        for (const key in data) {
            if (Array.isArray(data[key])) {
                messages.push(`${key}: ${data[key][0]}`);
            } else if (typeof data[key] === 'string') {
                messages.push(data[key]);
            }
        }
        if (messages.length > 0) {
            // Return first error or joined?
            // "password: This field is required." looks okay.
            return messages[0];
        }
    }

    // 4. Fallback to generic message or status text
    return error.message || defaultMessage;
};
