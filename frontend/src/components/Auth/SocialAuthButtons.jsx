import React from 'react';

/**
 * SocialAuthButtons - Google and Apple social login buttons
 * Refactored to use Tailwind CSS utility classes
 */
const SocialAuthButtons = () => {
    const handleGoogleAuth = () => {
        // TODO: Implement Google OAuth
        console.log('Google auth clicked');
    };

    const handleAppleAuth = () => {
        // TODO: Implement Apple OAuth
        console.log('Apple auth clicked');
    };

    const buttonBase = "flex-1 h-12 px-4 text-sm font-medium border border-border rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-md active:scale-[0.99]";

    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
            {/* Google Button */}
            <button
                type="button"
                onClick={handleGoogleAuth}
                className={`${buttonBase} bg-bg-surface text-text-primary hover:bg-bg-secondary border-border`}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M19.805 10.227c0-.709-.064-1.39-.182-2.045H10.1v3.868h5.438a4.651 4.651 0 01-2.019 3.052v2.507h3.268c1.913-1.761 3.018-4.356 3.018-7.382z" fill="#4285F4" />
                    <path d="M10.1 19.945c2.731 0 5.023-.906 6.697-2.454l-3.268-2.536c-.906.607-2.064.967-3.429.967-2.637 0-4.871-1.78-5.668-4.175H1.064v2.614a9.945 9.945 0 008.936 5.584z" fill="#34A853" />
                    <path d="M4.432 11.747a5.975 5.975 0 010-3.81V5.323H1.164a9.945 9.945 0 000 8.938l3.268-2.514z" fill="#FBBC05" />
                    <path d="M10.1 3.958c1.487 0 2.823.511 3.872 1.514l2.904-2.904C15.119.91 12.827 0 10.1 0A9.945 9.945 0 001.164 5.323l3.268 2.614c.797-2.394 3.031-4.175 5.668-4.175z" fill="#EA4335" />
                </svg>
                Google
            </button>

            {/* Apple Button */}
            <button
                type="button"
                onClick={handleAppleAuth}
                className={`${buttonBase} bg-text-primary text-text-inverted hover:opacity-90 border-text-primary`}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15.538 4.462c-.85.993-2.234 1.764-3.573 1.661-.17-1.334.502-2.742 1.292-3.615.85-1.009 2.32-1.736 3.497-1.779.133 1.392-.42 2.769-1.216 3.733zM17.5 13.966c-.344 1.029-.511 1.49-.958 2.398-.623 1.268-1.502 2.844-2.592 2.856-.973.013-1.227-.686-2.554-.678-1.327.009-1.612.691-2.584.678-1.09-.013-1.912-1.443-2.535-2.71-1.753-3.562-1.938-7.742-.856-9.964.771-1.583 1.99-2.512 3.134-2.512 1.166 0 1.898.692 2.862.692.933 0 1.502-.693 2.849-.693 1.017 0 2.093.697 2.863 1.898-2.517 1.502-2.108 5.415.42 7.035z" />
                </svg>
                Apple
            </button>
        </div>
    );
};

export default SocialAuthButtons;
