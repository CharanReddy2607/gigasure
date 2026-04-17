import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, Activity, Users, FileText, AlertTriangle, 
    CloudRain, Thermometer, MapPin, Zap, Info, 
    Search, TrendingUp, HandCoins, Globe, LayoutGrid
} from 'lucide-react';

function AdminDashboard() {
    const [stats, setStats] = useState({ totalWorkers: 0, totalPolicies: 0, totalClaims: 0 });
    const [workers, setWorkers] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [claims, setClaims] = useState([]);
    const [fraudLogs, setFraudLogs] = useState([]);
    const [disruption, setDisruption] = useState({ type: 'RAINFALL', metricValue: '', city: 'Mumbai', deliveryActivityDrop: '' });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const [statsRes, fraudRes, workersRes, policiesRes, claimsRes] = await Promise.all([
                api.get('dashboard/stats'),
                api.get('dashboard/fraud'),
                api.get('workers'),
                api.get('policies'), // Ensure this endpoint exists or fetch per worker
                api.get('claims')
            ]);
            setStats(statsRes.data);
            setFraudLogs(fraudRes.data);
            setWorkers(workersRes.data);
            setPolicies(policiesRes.data);
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

    const triggerEvent = (e) => {
        e.preventDefault();
        api.post('disruptions', disruption).then(res => {
            alert("Parametric Event Authorized! System processing claims...");
            fetchData();
        }).catch(err => {
            console.error("Disruption Trigger Error:", err);
            const errorMsg = err.response?.data?.message || err.message || "Unknown error";
            alert(`System Processing Error: ${errorMsg}\nPlease check backend logs for details.`);
        });
    };

    const getWorkerStats = (workerId) => {
        const workerPolicies = policies.filter(p => p.worker?.id === workerId || p.workerId === workerId);
        const workerClaims = claims.filter(c => {
            // Match claim to worker via policy
            const policy = policies.find(p => p.id === c.policy?.id || p.id === c.policyId);
            return (policy?.worker?.id === workerId || policy?.workerId === workerId) && c.status === 'APPROVED';
        });
        const totalPayout = workerClaims.reduce((sum, c) => sum + (c.payoutAmount || 0), 0);
        return { 
            policies: workerPolicies, 
            totalPayout: totalPayout 
        };
    };

    const filteredWorkers = workers.filter(w => 
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        w.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="spinner-glass">Initializing Command Center...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h1 className="dashboard-header mb-1 text-gradient">Command Center</h1>
                    <p className="text-muted mb-0">Fleet Telemetry & Parametric Integrity Engine</p>
                </div>
                <div className="d-flex gap-3">
                    <div className="glass-panel px-3 py-2 d-flex align-items-center gap-2 border-0 shadow-sm">
                        <Activity size={16} className="text-success" />
                        <span className="small fw-bold text-success text-uppercase">System Normal</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="row g-4 mb-5">
                {[
                    { label: 'Fleet Strength', val: stats.totalWorkers, icon: <Users size={20} />, color: '#6366f1' },
                    { label: 'Active Shields', val: stats.totalPolicies, icon: <Shield size={20} />, color: '#10b981' },
                    { label: 'Payout Volume', val: `₹${claims.reduce((acc, c) => acc + (c.status === 'APPROVED' ? c.payoutAmount : 0), 0)}`, icon: <HandCoins size={20} />, color: '#f59e0b' },
                    { label: 'Risk Logs', val: fraudLogs.length, icon: <AlertTriangle size={20} />, color: '#ef4444' }
                ].map((s, i) => (
                    <div key={i} className="col-md-3">
                        <div className="glass-panel p-4 h-100 border-0 shadow-sm position-relative overflow-hidden">
                            <div className="position-relative z-1">
                                <div className="text-muted small fw-bold mb-1 text-uppercase">{s.label}</div>
                                <div className="h2 fw-bold mb-0">{s.val}</div>
                            </div>
                            <div className="position-absolute end-0 bottom-0 p-3 opacity-10" style={{ color: s.color }}>
                                {s.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-5">
                {/* Simulation Engine */}
                <div className="col-lg-7">
                    <div className="glass-panel p-4 h-100 border-top border-4 border-primary">
                        <div className="d-flex align-items-center mb-4 gap-2">
                            <Zap className="text-primary" />
                            <h4 className="fw-bold m-0">Disruption Simulation</h4>
                        </div>
                        <form onSubmit={triggerEvent}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold opacity-50">TRIGGER TYPE</label>
                                    <select className="form-select border-0 bg-light py-3 rounded-4" value={disruption.type} onChange={e => setDisruption({ ...disruption, type: e.target.value })}>
                                        <option value="RAINFALL">Torrential Rainfall</option>
                                        <option value="HEATWAVE">Extreme Heatwave</option>
                                        <option value="CURFEW">Govt. Curfew</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold opacity-50">METRIC VALUE</label>
                                    <input type="number" step="0.1" className="form-control border-0 bg-light py-3 rounded-4" placeholder="Value (e.g. 45.0)" value={disruption.metricValue} onChange={e => setDisruption({ ...disruption, metricValue: e.target.value })} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold opacity-50">TARGET CITY</label>
                                    <input type="text" className="form-control border-0 bg-light py-3 rounded-4" placeholder="Station City" value={disruption.city} onChange={e => setDisruption({ ...disruption, city: e.target.value })} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold opacity-50">ACTIVITY DROP (%)</label>
                                    <input type="number" step="0.1" className="form-control border-0 bg-light py-3 rounded-4" placeholder="e.g. 40.0" value={disruption.deliveryActivityDrop} onChange={e => setDisruption({ ...disruption, deliveryActivityDrop: e.target.value })} required />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-4 py-3 rounded-pill fw-bold shadow-lg">Authorize Trigger</button>
                        </form>
                    </div>
                </div>

                {/* Integrity Bench */}
                <div className="col-lg-5">
                    <div className="glass-panel p-4 h-100 overflow-hidden border-top border-4 border-warning">
                        <div className="d-flex align-items-center mb-4 gap-2">
                            <Shield className="text-warning" />
                            <h4 className="fw-bold m-0">AI Integrity Guard</h4>
                        </div>
                        <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                            {fraudLogs.length > 0 ? (
                                fraudLogs.map(log => (
                                    <div key={log.id} className="p-3 mb-3 rounded-4 border-start border-4 border-warning bg-warning bg-opacity-5 small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="fw-bold">ANOMALY DETECTED</span>
                                            <span className="badge bg-warning text-dark">{log.severity}</span>
                                        </div>
                                        <div className="text-muted mb-2">{log.reason}</div>
                                        <div className="text-end opacity-50">{new Date(log.detectedDate).toLocaleTimeString()}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5 opacity-25">
                                    <Shield size={48} className="mx-auto mb-2" />
                                    <div className="fw-bold">Operational Clarity</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Worker Insights Hub */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <Globe className="text-primary" />
                        <h3 className="fw-bold m-0">Worker Insights Hub</h3>
                    </div>
                    <div className="d-flex gap-2">
                        <div className="input-group" style={{ width: '300px' }}>
                            <span className="input-group-text border-0 bg-white shadow-sm"><Search size={16} /></span>
                            <input 
                                type="text" 
                                className="form-control border-0 shadow-sm" 
                                placeholder="Search users or cities..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="insight-grid">
                    {filteredWorkers.map(w => {
                        const { policies: wPol, totalPayout } = getWorkerStats(w.id);
                        return (
                            <motion.div 
                                key={w.id} 
                                className="insight-card shadow-sm border-0"
                                whileHover={{ y: -5 }}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div className="d-flex gap-3 align-items-center">
                                        <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-4">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">{w.name}</h5>
                                            <span className="platform-badge">{w.platform || 'General'} Partner</span>
                                        </div>
                                    </div>
                                    <div className="geo-badge">
                                        <MapPin size={14} className="me-1" /> {w.city}
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <div className="p-3 bg-light rounded-4 h-100 flex-grow-1">
                                            <div className="small text-muted mb-1">Active Shield(s)</div>
                                            <div className="fw-bold">
                                                {wPol.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {wPol.map(p => (
                                                            <div key={p.id} className="badge bg-primary bg-opacity-10 text-primary rounded-pill small" style={{ fontSize: '0.6rem' }}>
                                                                {p.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <span className="text-muted small">No Active Plan</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 bg-light rounded-4 h-100 flex-grow-1">
                                            <div className="small text-muted mb-1">Total Disbursements</div>
                                            <div className="fw-bold text-success">₹{totalPayout}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto d-flex flex-column gap-2 pt-3 border-top border-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="small text-muted">
                                            <TrendingUp size={12} className="me-1" /> 
                                            Trust Index: <span className="fw-bold text-dark">{(100 - (w.currentRiskScore || 0)*10).toFixed(1)}%</span>
                                        </div>
                                        <div className="small text-muted">
                                            Safety: <span className="fw-bold text-primary">{w.safetyRating || '4.5'}/5</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="small text-muted">
                                            Delivery Freq: <span className="fw-bold">{(w.deliveryFrequency * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="small opacity-50" style={{ fontSize: '0.65rem' }}>
                                            GPS Cluster: {w.currentLat?.toFixed(2)}, {w.currentLng?.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default AdminDashboard;
