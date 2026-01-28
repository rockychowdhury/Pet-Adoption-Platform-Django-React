import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/Contexts';
import useAPI from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import { Phone, Check, Loader2, AlertCircle } from 'lucide-react';

const WhatsAppVerifier = () => {
    const { user, getUser } = useContext(AuthContext);
    const api = useAPI();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    // Pre-fill phone number from user profile
    useEffect(() => {
        if (user?.phone_number) {
            setPhoneNumber(user.phone_number);
        }
    }, [user]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendCode = async () => {
        if (!phoneNumber || !phoneNumber.trim()) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/user/request-phone-verify/', {
                phone_number: phoneNumber
            });

            if (response.data.success) {
                setCodeSent(true);
                setCountdown(60); // 60 seconds before allowing resend
                toast.success('Verification code sent to your WhatsApp!');
            }
        } catch (err) {
            console.error('Error sending code:', err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to send verification code';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        if (!verifyCode || verifyCode.trim().length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setVerifying(true);
        setError('');

        try {
            const response = await api.post('/user/verify-phone-code/', {
                code: verifyCode
            });

            if (response.data.success) {
                toast.success('Phone number verified successfully!');
                await getUser(); // Refresh user data
                setCodeSent(false);
                setVerifyCode('');
            }
        } catch (err) {
            console.error('Error verifying code:', err);
            const errorMsg = err.response?.data?.error || 'Invalid verification code';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setVerifying(false);
        }
    };

    const handleResendCode = () => {
        setCodeSent(false);
        setVerifyCode('');
        setError('');
        handleSendCode();
    };

    if (user?.phone_verified) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="text-white" size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-green-900">Phone Number Verified</p>
                        <p className="text-sm text-green-700">{user.phone_number}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md">
            <style jsx>{`
                .otp-input {
                    width: 100%;
                    padding: 12px 16px;
                    font-size: 18px;
                    letter-spacing: 8px;
                    text-align: center;
                    font-weight: 600;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .otp-input:focus {
                    outline: none;
                    border-color: #25d366;
                    box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.1);
                }
                .whatsapp-button {
                    background: linear-gradient(135deg, #25d366 0%, #20ba5a 100%);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
                }
                .whatsapp-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(37, 211, 102, 0.4);
                }
                .whatsapp-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .verify-button {
                    background: #25d366;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 100%;
                }
                .verify-button:hover:not(:disabled) {
                    background: #20ba5a;
                }
                .verify-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>

            {!codeSent ? (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number (with country code)
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+880 1234 567890"
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Include country code (e.g., +880 for Bangladesh)
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSendCode}
                        disabled={loading || !phoneNumber}
                        className="whatsapp-button w-full justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Phone size={20} />
                                Send Verification Code
                            </>
                        )}
                    </button>
                </>
            ) : (
                <form onSubmit={handleVerifyCode}>
                    <div className="mb-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-2">
                                <Phone className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="text-sm font-semibold text-blue-900">Code sent!</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Check your WhatsApp messages for a 6-digit verification code.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Enter Verification Code
                        </label>
                        <input
                            type="text"
                            value={verifyCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setVerifyCode(value);
                            }}
                            placeholder="000000"
                            maxLength={6}
                            className="otp-input"
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Code expires in 15 minutes
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={verifying || verifyCode.length !== 6}
                        className="verify-button mb-3"
                    >
                        {verifying ? (
                            <>
                                <Loader2 className="animate-spin inline mr-2" size={18} />
                                Verifying...
                            </>
                        ) : (
                            'Verify Code'
                        )}
                    </button>

                    <div className="text-center">
                        {countdown > 0 ? (
                            <p className="text-sm text-gray-500">
                                Resend code in {countdown}s
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline"
                            >
                                Didn't receive code? Resend
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-700 mb-2">📱 How it works:</p>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Enter your WhatsApp number with country code</li>
                    <li>We'll send a 6-digit code to your WhatsApp</li>
                    <li>Enter the code above to verify your number</li>
                    <li>You're all set!</li>
                </ol>
            </div>
        </div>
    );
};

export default WhatsAppVerifier;
