import React, { useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, Info, AlertTriangle, TrendingUp, Zap, Clock, ShieldCheck } from 'lucide-react';

function PolicyPage() {
    const [purchasing, setPurchasing] = useState(null);
    const [success, setSuccess] = useState(false);

    const WORKER_ID = 1;

    const ALL_PLANS = [
        { 
            id: 'p1', 
            name: "Monsoon Master", 
            premium: 120, 
            coverage: 60000, 
            description: "High-precision rain protection specialized for tropical monsoons.",
            features: ["Rainfall > 35mm trigger", "60% Income replacement", "Instant payouts"],
            color: "#6366f1",
            icon: <Zap size={24} />
        },
        { 
            id: 'p2', 
            name: "Heatwave Hero", 
            premium: 95, 
            coverage: 45000, 
            description: "Built for peak summer. Protects against delivery drops during severe heat.",
            features: ["Temp > 42°C trigger", "Heat exhaustion bonus", "Cooling voucher included"],
            color: "#f59e0b",
            icon: <TrendingUp size={24} />
        },
        { 
            id: 'p3', 
            name: "Urban Guardian", 
            premium: 180, 
            coverage: 80000, 
            description: "The ultimate protection suite for busy metro workers. Covers all disasters.",
            features: ["Multi-event trigger", "Curfew protection", "Highest priority processing"],
            color: "#10b981",
            icon: <ShieldCheck size={24} />
        },
        { 
            id: 'p4', 
            name: "Night Owl", 
            premium: 65, 
            coverage: 25000, 
            description: "Essential late-night coverage for safety and service disruptions.",
            features: ["11PM - 5AM validity", "Road safety coverage", "Low cost entry"],
            color: "#a855f7",
            icon: <Clock size={24} />
        },
        { 
            id: 'p5', 
            name: "GigaLite", 
            premium: 55, 
            coverage: 20000, 
            description: "Standard parametric shield for essential protection on a budget.",
            features: ["Basic rainfall trigger", "24/7 Monitoring", "Standard support"],
            color: "#94a3b8",
            icon: <Shield size={24} />
        }
    ];

    const handlePurchase = async (plan) => {
        setPurchasing(plan.id);
        try {
            await api.post('/policies', {
                name: plan.name,
                weeklyPremium: plan.premium,
                coverageAmount: plan.coverage,
                worker: { id: WORKER_ID }
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            alert("Error connecting to GigaSure safe. Try again later.");
        } finally {
            setPurchasing(null);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-5 text-center">
                <h1 className="dashboard-header mb-2">Policy Marketplace</h1>
                <p className="text-muted fs-5">Select a paramatric shield tailored for your gig mobility needs.</p>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="alert alert-success glass-panel text-center fw-bold mb-4 border-0 shadow-lg"
                    >
                        Success! Policy activated and synced with your Shield Dashboard.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="marketplace-grid">
                {ALL_PLANS.map(plan => (
                    <motion.div 
                        key={plan.id}
                        className="policy-marketplace-card d-flex flex-column"
                        whileHover={{ y: -10 }}
                    >
                        <div className="p-4 flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div className="p-3 rounded-4" style={{ backgroundColor: `${plan.color}20`, color: plan.color }}>
                                    {plan.icon}
                                </div>
                                <div className="text-end">
                                    <div className="small text-muted text-uppercase fw-bold">Weekly</div>
                                    <div className="plan-price-tag">₹{plan.premium}</div>
                                </div>
                            </div>

                            <h3 className="fw-bold mb-3">{plan.name}</h3>
                            <p className="text-muted small mb-4">{plan.description}</p>

                            <ul className="list-unstyled mb-0">
                                {plan.features.map(f => (
                                    <li key={f} className="d-flex align-items-center gap-2 mb-2 small fw-medium">
                                        <Check size={16} className="text-success" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-4 bg-light bg-opacity-50 border-top mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="small text-muted">Max Coverage</span>
                                <span className="fw-bold text-dark">₹{plan.coverage.toLocaleString()}</span>
                            </div>
                            <button 
                                className={`btn w-100 py-3 rounded-pill fw-bold transition-all ${purchasing === plan.id ? 'btn-secondary opacity-50' : 'btn-primary'}`}
                                onClick={() => handlePurchase(plan)}
                                disabled={purchasing !== null}
                                style={{ backgroundColor: plan.color, borderColor: plan.color }}
                            >
                                {purchasing === plan.id ? 'Activating Shield...' : 'Confirm Activation'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-5 p-5 glass-panel text-center bg-primary bg-opacity-5">
                <div className="d-flex justify-content-center gap-3 mb-3 text-primary">
                    <Info size={32} />
                    <AlertTriangle size={32} />
                </div>
                <h4 className="fw-bold">How Parametric Insurance Works</h4>
                <p className="text-muted max-w-2xl mx-auto">
                    Unlike traditional insurance, GigaSure uses real-time weather and activity data to trigger <strong>Instant Payouts</strong>. 
                    If extreme rain or a heatwave hits your city and courier activity drops, your payout is calculated and released 
                    to your wallet automatically. No claims forms, no waiting.
                </p>
            </div>
        </motion.div>
    );
}

export default PolicyPage;
