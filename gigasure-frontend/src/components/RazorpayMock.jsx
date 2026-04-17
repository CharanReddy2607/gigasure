import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Smartphone, CreditCard, Landmark, CheckCircle2, 
    ChevronRight, X, Shield, Lock, Loader2, ArrowLeft 
} from 'lucide-react';

function RazorpayMock({ show, onClose, onPaymentSuccess, amount, planName }) {
    const [step, setStep] = useState('options'); // 'options', 'processing', 'success'
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handlePayment = () => {
        setStep('processing');
        // Automated verification simulation after 3 seconds
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onPaymentSuccess();
                onClose();
            }, 2000);
        }, 3000);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <div className="razorpay-overlay d-flex align-items-center justify-content-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="razorpay-modal shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="razorpay-header p-4 d-flex justify-content-between align-items-start text-white">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-white p-2 rounded-2">
                                <Shield className="text-primary" size={24} />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">GigaSure Insurance</h6>
                                <p className="extra-small mb-0 opacity-75">Pay for {planName}</p>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="extra-small opacity-75 fw-bold">AMOUNT</div>
                            <div className="h5 mb-0 fw-bold">₹{amount}</div>
                        </div>
                        <X 
                            size={20} 
                            className="position-absolute cursor-pointer" 
                            style={{ top: '15px', right: '15px', color: 'rgba(255,255,255,0.5)' }} 
                            onClick={onClose} 
                        />
                    </div>

                    {/* Content */}
                    <div className="razorpay-content bg-white p-0">
                        {step === 'options' && (
                            <div className="p-4">
                                <p className="text-muted small fw-bold mb-3 d-flex align-items-center gap-2">
                                    PREFERRED PAYMENT METHODS
                                </p>
                                
                                <PaymentOption 
                                    icon={<Smartphone className="text-primary" />}
                                    title="UPI / Google Pay"
                                    desc="Pay via your preferred UPI app"
                                    onClick={() => { setSelectedMethod('UPI'); handlePayment(); }}
                                />
                                
                                <PaymentOption 
                                    icon={<CreditCard className="text-primary" />}
                                    title="Card"
                                    desc="Visa, Mastercard, RuPay, Maestro"
                                    onClick={() => { setSelectedMethod('Card'); handlePayment(); }}
                                />
                                
                                <PaymentOption 
                                    icon={<Landmark className="text-primary" />}
                                    title="Netbanking"
                                    desc="All Indian banks supported"
                                    onClick={() => { setSelectedMethod('Netbanking'); handlePayment(); }}
                                />

                                <div className="mt-5 text-center">
                                    <div className="extra-small text-muted d-flex align-items-center justify-content-center gap-1 mb-2">
                                        <Lock size={10} /> 100% SECURE & ENCRYPTED
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center gap-3 grayscale opacity-30">
                                        <div className="extra-small fw-bold">PCI-DSS</div>
                                        <div className="extra-small fw-bold">VISA</div>
                                        <div className="extra-small fw-bold">MASTERCARD</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'processing' && (
                            <div className="p-5 text-center d-flex flex-column align-items-center justify-content-center mt-4">
                                <Loader2 className="text-primary mb-4 animate-spin" size={60} strokeWidth={1} />
                                <h5 className="fw-bold mb-2">Verifying with {selectedMethod}...</h5>
                                <p className="text-muted small px-4">
                                    Communicating with banking partner's server to verify your transaction. This might take a few seconds.
                                </p>
                                <div className="mt-4 p-3 rounded-4 bg-light w-100 d-flex align-items-center gap-3 border border-dark border-opacity-5">
                                    <div className="vibrant-bg p-2 rounded-circle text-white"><Shield size={16} /></div>
                                    <div className="text-start extra-small fw-bold text-muted">
                                        GIGASURE SECURE VERIFICATION IN PROGRESS
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="p-5 text-center d-flex flex-column align-items-center justify-content-center mt-4 mb-4">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-success text-white p-4 rounded-circle mb-4"
                                >
                                    <CheckCircle2 size={60} />
                                </motion.div>
                                <h4 className="fw-bold text-success mb-2">Payment Verified!</h4>
                                <p className="text-muted small px-4">
                                    Transaction successful. Your GigaSure shield is being activated now.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="razorpay-footer p-3 bg-light border-top text-center text-muted extra-small">
                        PROCESSED BY <strong className="text-dark opacity-50">RAZORPAY GATEWAY</strong> (TEST MODE)
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function PaymentOption({ icon, title, desc, onClick }) {
    return (
        <motion.div 
            whileHover={{ backgroundColor: '#f8fafc', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="d-flex align-items-center justify-content-between p-3 rounded-4 cursor-pointer mb-2 border border-dark border-opacity-5"
            style={{ transition: 'all 0.2s ease' }}
        >
            <div className="d-flex align-items-center gap-3">
                <div className="bg-light p-3 rounded-4">
                    {icon}
                </div>
                <div>
                    <div className="fw-bold text-dark small">{title}</div>
                    <div className="text-muted extra-small">{desc}</div>
                </div>
            </div>
            <ChevronRight size={18} className="text-muted opacity-50" />
        </motion.div>
    );
}

export default RazorpayMock;
