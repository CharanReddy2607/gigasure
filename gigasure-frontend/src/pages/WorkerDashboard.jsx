import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Activity, Bell, FileText, CheckCircle, AlertCircle, MapPin, TrendingUp, CloudRain } from 'lucide-react';

function WorkerDashboard() {
    const [worker, setWorker] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    const WORKER_ID = 1;

    const getPlanColor = (name) => {
        const colors = {
            "Monsoon Master": "#6366f1",
            "Heatwave Hero": "#f59e0b",
            "Urban Guardian": "#10b981",
            "Night Owl": "#a855f7",
            "GigaLite": "#94a3b8"
        };
        return colors[name] || "#6366f1";
    };

    const fetchData = async () => {
        try {
            const [workerRes, policiesRes, notifRes, claimsRes] = await Promise.all([
                api.get(`/workers/${WORKER_ID}`),
                api.get(`/policies/worker/${WORKER_ID}`),
                api.get(`/notifications/worker/${WORKER_ID}`),
                api.get(`/claims/worker/${WORKER_ID}`)
            ]);
            setWorker(workerRes.data);
            setPolicies(policiesRes.data);
            setNotifications(notifRes.data);
            setClaims(claimsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="spinner-glass">Syncing with GigaSure Shield...</div>;
    if (!worker) return <div className="p-5 text-center">Connection Error</div>;

    const upgradeAlerts = notifications.filter(n => n.message.startsWith('UPGRADE_ALERT'));

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="container py-5"
        >
            {/* Top Bar */}
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="dashboard-header mb-0">Hi, {worker.name.split(' ')[0]}</h2>
                    <p className="text-muted"><MapPin size={14} className="me-1" />{worker.city} • {worker.platform} Partner</p>
                </div>
                <div className="d-flex gap-3">
                    <div className="notification-bell">
                        <Bell size={20} className="text-primary" />
                        {notifications.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>{notifications.length}</span>}
                    </div>
                    <div className="glass-panel px-3 py-2 d-flex align-items-center gap-2">
                        <div className="vibrant-gradient rounded-circle p-1"><User size={16} /></div>
                        <span className="small fw-bold">{worker.name}</span>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column: Profile & Stats */}
                <div className="col-lg-4">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="glass-panel p-4 vibrant-gradient mb-4 overflow-hidden position-relative shadow-lg"
                    >
                        <div className="position-relative z-1">
                            <div className="small opacity-75 fw-bold text-uppercase mb-1">Average Daily Income</div>
                            <div className="display-5 fw-bold mb-4">₹{worker.dailyIncome}</div>
                            
                            <div className="d-flex justify-content-between align-items-end">
                                <div>
                                    <div className="small opacity-75 fw-bold text-uppercase">Trust Index</div>
                                    <div className="h4 fw-bold mb-0">{(100 - (worker.currentRiskScore || 0) * 10).toFixed(1)}%</div>
                                </div>
                                <div className="text-end">
                                    <Activity size={32} className="opacity-50" />
                                </div>
                            </div>
                        </div>
                        <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'translate(20%, -20%)' }}>
                            <Shield size={200} />
                        </div>
                    </motion.div>

                    <div className="glass-panel p-4 mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <TrendingUp size={18} className="text-primary me-2" />
                            <h5 className="m-0 fw-bold">Parametric Risk Monitor</h5>
                        </div>
                        <div className="p-3 bg-light rounded-4 border-start border-3 border-info mb-3">
                            <div className="small text-muted mb-1">Current Weather Threat</div>
                            <div className="d-flex align-items-center gap-2">
                                <CloudRain className="text-info" size={20} />
                                <span className="fw-bold">Moderate (12% Risk)</span>
                            </div>
                        </div>
                        <p className="small text-muted mb-0">AI predicts 98.4% activity stability for the next 6 hours.</p>
                    </div>

                    {/* Shield Impact Card */}
                    <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="glass-panel p-4 border-0 shadow-lg position-relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', color: 'white' }}
                    >
                        <div className="position-relative z-1">
                            <h6 className="text-uppercase fw-bold opacity-75 small mb-2">Shield Impact</h6>
                            {claims.filter(c => c.status === 'APPROVED').length > 0 ? (
                                <>
                                    <div className="d-flex align-items-baseline gap-2">
                                        <span className="display-6 fw-bold">₹{claims.reduce((acc, c) => acc + (c.status === 'APPROVED' ? c.payoutAmount : 0), 0)}</span>
                                        <span className="small opacity-75">Disbursed</span>
                                    </div>
                                    <hr className="opacity-25" />
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="opacity-75">Loss Recovered</span>
                                            <span className="fw-bold">100%</span>
                                        </div>
                                        <p className="mb-0 opacity-75 x-small" style={{ fontSize: '0.7rem' }}>
                                            Successfully mitigated impact from {claims.filter(c => c.status === 'APPROVED').length} disruption event(s).
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="d-flex align-items-baseline gap-2">
                                        <span className="display-6 fw-bold opacity-50">₹0</span>
                                        <span className="small opacity-75">Active Shield</span>
                                    </div>
                                    <hr className="opacity-25" />
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="opacity-75">Risk Coverage</span>
                                            <span className="fw-bold">Active</span>
                                        </div>
                                        <p className="mb-0 opacity-75 x-small" style={{ fontSize: '0.7rem' }}>
                                            Ready to protect up to ₹{worker.dailyIncome * 1.5} income during the next weather event.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="position-absolute bottom-0 end-0 p-3 opacity-20">
                            <Shield size={64} />
                        </div>
                    </motion.div>
                </div>

                {/* Middle Column: Policies & Claims */}
                <div className="col-lg-8">
                    {/* Alerts */}
                    <AnimatePresence>
                        {upgradeAlerts.length > 0 && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                className="mb-4"
                            >
                                {upgradeAlerts.map(alert => (
                                    <div key={alert.id} className="glass-panel p-4 border-start border-4 border-danger bg-danger bg-opacity-10">
                                        <div className="d-flex align-items-center gap-2 mb-2 text-danger">
                                            <AlertCircle size={20} />
                                            <h5 className="fw-bold m-0">Dynamic Risk Adjustment</h5>
                                        </div>
                                        <p className="mb-3">{alert.message.replace('UPGRADE_ALERT: ', '')}</p>
                                        <button className="btn btn-danger px-4 rounded-pill fw-bold">Upgrade Coverage Now</button>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Coverage */}
                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <Shield className="text-secondary" /> Active Coverage
                            </h4>
                            <span className="badge bg-light text-dark border rounded-pill px-3">{policies.length} Policies</span>
                        </div>
                        <div className="row g-3">
                            {policies.map(p => (
                                <div key={p.id} className="col-md-6">
                                    <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-4 h-100 border-top border-4" style={{ borderColor: getPlanColor(p.name) }}>
                                        <div className="d-flex justify-content-between mb-3">
                                            <div className="badge bg-success bg-opacity-10 text-success badge-premium">{p.name || 'GigaProtect'}</div>
                                            <FileText className="text-muted opacity-50" size={18} />
                                        </div>
                                        <div className="small text-muted mb-1">Max Coverage</div>
                                        <div className="h3 fw-bold text-dark mb-3">₹{p.coverageAmount}</div>
                                        <div className="small text-muted">Weekly Premium: <span className="fw-bold text-primary">₹{p.weeklyPremium}</span></div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Claims & Payouts */}
                    <div>
                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <CheckCircle className="text-primary" /> Automated Payouts
                        </h4>
                        <div className="glass-panel p-0 overflow-hidden">
                            {claims.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-light">
                                            <tr className="small text-muted text-uppercase fw-bold">
                                                <th className="px-4 py-3">Reason</th>
                                                <th className="py-3">Amount</th>
                                                <th className="py-3 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {claims.map(c => (
                                                <tr key={c.id}>
                                                    <td className="px-4 py-3 small fw-bold">{c.triggerReason}</td>
                                                    <td className="py-3 fw-bold text-success">₹{c.payoutAmount}</td>
                                                    <td className="py-3 text-center">
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
                                    <Activity className="opacity-25 mb-2" />
                                    <div>No parametric claims triggered recently.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default WorkerDashboard;
