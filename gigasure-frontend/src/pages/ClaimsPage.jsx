import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Shield, Activity, Bell, FileText, CheckCircle, AlertCircle, TrendingUp, HandCoins, ExternalLink } from 'lucide-react';

function ClaimsPage() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    const WORKER_ID = 1;

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const res = await api.get(`claims/worker/${WORKER_ID}`);
                setClaims(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    if (loading) return <div className="spinner-glass">Loading Payout Central...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-5">
                <h1 className="dashboard-header mb-2 d-flex align-items-center gap-3">
                    <HandCoins size={40} className="text-primary" /> Payout Central
                </h1>
                <p className="text-muted fs-5">Track your automated parametric disbursements in real-time.</p>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="glass-panel p-4 mb-4 bg-primary bg-opacity-5">
                        <div className="d-flex align-items-center mb-3">
                            <Activity size={20} className="text-primary me-2" />
                            <h5 className="m-0 fw-bold">Integrity Guard</h5>
                        </div>
                        <div className="p-3 bg-white rounded-4 border shadow-sm mb-3">
                            <div className="small text-muted mb-1">Lifetime Payouts</div>
                            <div className="h2 fw-bold text-dark">₹{claims.reduce((acc, c) => acc + (c.status === 'APPROVED' ? c.payoutAmount : 0), 0)}</div>
                        </div>
                        <div className="d-flex gap-2">
                            <div className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">8.2 Trust Index</div>
                            <div className="badge bg-info bg-opacity-10 text-info rounded-pill px-3">0 Pending</div>
                        </div>
                    </div>

                    <div className="glass-panel p-4">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <AlertCircle size={16} className="text-warning" /> AI Risk Analysis
                        </h6>
                        <p className="small text-muted mb-0">
                            Our AI Integrity Guard verifies each disruption event against multi-source weather satellites 
                            and courier activity telemetry to ensure 99.9% payout accuracy.
                        </p>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="glass-panel p-0 overflow-hidden shadow-lg border-primary border-opacity-10">
                        {claims.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="bg-light">
                                        <tr className="small text-muted text-uppercase fw-bold">
                                            <th className="px-4 py-4">Trigger Event</th>
                                            <th className="py-4">Disbursement</th>
                                            <th className="py-4">Timestamp</th>
                                            <th className="py-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {claims.map(c => (
                                            <tr key={c.id}>
                                                <td className="px-4 py-4 fw-bold text-dark d-flex align-items-center gap-2">
                                                    {c.triggerReason.toLowerCase().includes('rain') ? <TrendingUp size={16} className="text-info" /> : <Shield size={16} className="text-warning" />}
                                                    {c.triggerReason}
                                                </td>
                                                <td className="py-4 fw-bold text-success fs-5">₹{c.payoutAmount}</td>
                                                <td className="py-4 small text-muted">
                                                    {new Date(c.claimDate).toLocaleDateString()} <br />
                                                    {new Date(c.claimDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="py-4 text-center align-middle">
                                                    <span className={`badge-premium ${c.status === 'APPROVED' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-5 text-center text-muted">
                                <Activity size={48} className="opacity-10 mb-3 mx-auto" />
                                <div className="fw-bold">No High-Risk Events Tracked</div>
                                <p className="small">Your shielded zones are currently stable. We're monitoring 24/7.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ClaimsPage;
