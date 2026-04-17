import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Components
import AdminDashboard from './pages/AdminDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import PolicyPage from './pages/PolicyPage';
import ClaimsPage from './pages/ClaimsPage';
import AuthPage from './pages/AuthPage';

import { 
    LayoutDashboard, Shield, ShieldCheck, Activity, 
    Lock, Unlock, LogOut, Bell, KeySquare, Globe
} from 'lucide-react';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gigasure_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [otpAlert, setOtpAlert] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const handleOtp = (e) => {
      setOtpAlert(e.detail);
      setTimeout(() => setOtpAlert(null), 15000);
    };
    window.addEventListener('GIGASURE_OTP_SENT', handleOtp);
    return () => window.removeEventListener('GIGASURE_OTP_SENT', handleOtp);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('gigasure_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('gigasure_user');
  };

  // Admin Access Guard Component
  const AdminGuard = ({ children }) => {
    const [pass, setPass] = useState('');
    const [error, setError] = useState(false);

    if (isAdminAuthenticated) return children;

    const handleVerifyAdmin = (e) => {
        e.preventDefault();
        if (pass === 'admin123') {
            setIsAdminAuthenticated(true);
        } else {
            setError(true);
            setPass('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass-panel p-5 text-center shadow-2xl border-top border-4 ${error ? 'border-danger error-shake' : 'border-primary'}`}
                style={{ maxWidth: '400px' }}
            >
                <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                    <Lock size={40} className="text-primary" />
                </div>
                <h3 className="fw-bold mb-2">Restricted Access</h3>
                <p className="text-muted small mb-4">The Command Center requires administrative authorization to proceed.</p>
                
                <form onSubmit={handleVerifyAdmin}>
                    <input 
                        type="password" 
                        className="form-control border-0 bg-light py-3 rounded-4 mb-3 text-center fs-5 shadow-sm"
                        placeholder="Enter Security Key"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        autoFocus
                    />
                    <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-lg">
                        Authorize Access
                    </button>
                    {error && <div className="text-danger small fw-bold mt-3 animate-pulse">Invalid Authorization Key</div>}
                </form>
            </motion.div>
        </div>
    );
  };

  return (
    <Router>
      <div className="flex-container d-flex flex-column min-vh-100">
        {user ? (
          <>
            <nav className="nav-glass d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-4">
                <Link className="navbar-brand fw-bold d-flex align-items-center gap-2 text-dark text-decoration-none" to="/">
                  <div className="vibrant-gradient p-2 rounded-3 text-white shadow-sm"><Shield size={20} /></div>
                  <span className="fs-4">GigaSure</span>
                </Link>
                <div className="d-flex gap-2">
                  <Link className="nav-link-premium d-flex align-items-center gap-2" to="/"><LayoutDashboard size={18} /> Dashboard</Link>
                  <Link className="nav-link-premium d-flex align-items-center gap-2" to="/admin"><Globe size={18} /> Admin Hub</Link>
                  <Link className="nav-link-premium d-flex align-items-center gap-2" to="/policies"><Shield size={18} /> Plans</Link>
                  <Link className="nav-link-premium d-flex align-items-center gap-2" to="/claims"><Activity size={18} /> Claims</Link>
                </div>
              </div>

              <div className="d-flex align-items-center gap-4">
                <div className="notification-bell">
                  <Bell size={20} />
                  <span className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle" style={{top: '15%', right: '5%'}}></span>
                </div>
                <div className="d-flex align-items-center gap-3 border-start ps-4">
                  <div className="text-end">
                    <div className="small fw-bold">{user.name}</div>
                    <div className="extra-small text-muted">{user.platform || 'Worker'} Partner</div>
                  </div>
                  <div className="avatar rounded-circle border p-1" style={{ width: '40px', height: '40px' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-circle p-2 ms-2">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </nav>

            <div className="container-fluid py-4 px-5 flex-grow-1">
              <Routes>
                <Route path="/" element={<WorkerDashboard />} /> 
                <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} /> 
                <Route path="/policies" element={<PolicyPage />} />
                <Route path="/claims" element={<ClaimsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </>
        ) : (
          <div className="flex-grow-1">
            <Routes>
              <Route path="/auth" element={<AuthPage onLoginSuccess={handleLogin} />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
          </div>
        )}

        {/* Real-Time OTP System Alert Tool */}
        <AnimatePresence>
          {otpAlert && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 100, x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ left: '50%', zIndex: 9999 }}
              className="position-fixed bottom-0 mb-5"
            >
              <div className="glass-panel p-4 border-primary border-opacity-25 shadow-2xl overflow-hidden" style={{ minWidth: '320px' }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary p-3 rounded-4 text-white shadow-lg">
                    <KeySquare size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="extra-small fw-bold text-primary text-uppercase mb-1 letter-spacing-1">GigaSure System Alert</div>
                    <div className="h4 fw-bold mb-0">OTP: <span className="text-primary text-gradient">{otpAlert}</span></div>
                  </div>
                  <button className="btn ms-auto p-1" onClick={() => setOtpAlert(null)}>
                    <Unlock size={18} className="text-muted" />
                  </button>
                </div>
                <div className="mt-3 progress" style={{ height: '3px', background: 'rgba(0,0,0,0.05)' }}>
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 15 }}
                    className="progress-bar bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
