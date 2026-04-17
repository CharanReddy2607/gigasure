import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
    Phone, ShieldCheck, ArrowRight, Loader2, 
    Smartphone, Lock, RefreshCw, ChevronLeft,
    CheckCircle2, AlertCircle
} from 'lucide-react';

function AuthPage({ onLoginSuccess }) {
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (phoneNumber.length < 9) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.post('auth/otp/send', { phoneNumber });
            setStep('otp');
            setTimer(30);
            // In our demo, we show the OTP in a toast or console
            console.log("SIMULATED OTP:", res.data.otp);
            // Trigger a global system event for the App component to show the OTP alert
            window.dispatchEvent(new CustomEvent('GIGASURE_OTP_SENT', { detail: res.data.otp }));
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) return;

        setLoading(true);
        setError('');
        try {
            const res = await api.post('auth/otp/verify', { 
                phoneNumber, 
                otp: fullOtp 
            });
            onLoginSuccess(res.data);
        } catch (err) {
            setError('Invalid OTP. Please check and try again.');
            setOtp(['', '', '', '', '', '']);
            otpRefs[0].current.focus();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (otp.join('').length === 6) {
            handleVerifyOtp();
        }
    }, [otp]);

    return (
        <div className="auth-container">
            <div className="auth-bg-overlay"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card glass-panel p-5 overflow-hidden"
            >
                {/* Logo & Branding */}
                <div className="text-center mb-5">
                    <div className="vibrant-bg p-3 d-inline-block rounded-4 mb-3 shadow-lg">
                        <ShieldCheck className="text-white" size={40} />
                    </div>
                    <h2 className="fw-bold mb-1">GigaSure</h2>
                    <p className="text-muted small">Your Parametric Shield for Gig Mobility</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'phone' ? (
                        <motion.div 
                            key="phone"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <h4 className="fw-bold mb-4">Welcome Back</h4>
                            <p className="text-muted small mb-4">Enter your phone number to access your account or register a new one.</p>
                            
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-4">
                                    <label className="small fw-bold text-muted mb-2 text-uppercase letter-spacing-1">Phone Number</label>
                                    <div className="input-with-icon">
                                        <div className="input-icon-box">
                                            <Phone size={18} />
                                        </div>
                                        <div className="country-code">+91</div>
                                        <input 
                                            type="tel" 
                                            className="auth-input ps-5 ms-5"
                                            placeholder="98765 43210"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="alert alert-danger p-2 small border-0 mb-4 d-flex align-items-center gap-2"
                                    >
                                        <AlertCircle size={16} /> {error}
                                    </motion.div>
                                )}

                                <button 
                                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-lg vibrant-gradient border-0 d-flex align-items-center justify-content-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Get Verification Code <ArrowRight size={18} /></>}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button 
                                className="btn p-0 mb-4 text-primary small fw-bold d-flex align-items-center gap-1"
                                onClick={() => setStep('phone')}
                            >
                                <ChevronLeft size={16} /> Edit Number
                            </button>
                            
                            <h4 className="fw-bold mb-2">Verify Account</h4>
                            <p className="text-muted small mb-4">We've sent a 6-digit code to <span className="text-dark fw-bold">+91 {phoneNumber}</span></p>

                            <div className="d-flex justify-content-between gap-2 mb-4">
                                {otp.map((digit, i) => (
                                    <input 
                                        key={i}
                                        ref={otpRefs[i]}
                                        type="text"
                                        maxLength="1"
                                        className="otp-box text-center"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                    />
                                ))}
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="alert alert-danger p-2 small border-0 mb-4 d-flex align-items-center gap-2"
                                >
                                    <AlertCircle size={16} /> {error}
                                </motion.div>
                            )}

                            <div className="text-center">
                                <p className="small text-muted mb-2">Didn't receive code?</p>
                                <button 
                                    className="btn btn-link p-0 small fw-bold text-decoration-none"
                                    disabled={timer > 0 || loading}
                                    onClick={handleSendOtp}
                                >
                                    {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                                </button>
                            </div>

                            <div className="mt-5 p-3 rounded-4 bg-light border border-dark border-opacity-5 d-flex align-items-center gap-3">
                                <Lock className="text-primary opacity-50" size={20} />
                                <div className="text-start">
                                    <div className="small fw-bold text-dark">Secure Verification</div>
                                    <div className="extra-small text-muted">256-bit AES Encryption Active</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-5 text-center">
                    <p className="extra-small text-muted opacity-50">BY CONTINUING, YOU AGREE TO THE GIGASURE TERMS OF SERVICE</p>
                </div>
            </motion.div>
        </div>
    );
}

export default AuthPage;
