import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PolicyPage from './pages/PolicyPage';
import ClaimsPage from './pages/ClaimsPage';

import { LayoutDashboard, Shield, ShieldCheck, Activity, Lock, Unlock } from 'lucide-react';

function App() {
  const [isAdmin, setIsAdmin] = React.useState(false);

  const toggleAdmin = () => {
    if (!isAdmin) {
      const pass = prompt("Enter Admin Security Key:");
      if (pass === "admin123") setIsAdmin(true);
      else if (pass !== null) alert("Invalid Key. Access Denied.");
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <Router>
      <div className="container-fluid p-0 min-vh-100">
        <nav className="nav-glass mb-4">
          <div className="container d-flex justify-content-between align-items-center">
            <Link className="navbar-brand fw-bold d-flex align-items-center gap-2 text-dark" to="/">
              <div className="vibrant-gradient p-2 rounded-3 text-white"><Shield size={20} /></div>
              <span className="fs-4">GigaSure</span>
            </Link>
            <div className="d-flex gap-2 align-items-center">
              <Link className="nav-link-premium d-flex align-items-center gap-2" to="/"><LayoutDashboard size={18} /> Dashboard</Link>
              {isAdmin && (
                <Link className="nav-link-premium d-flex align-items-center gap-2" to="/admin"><ShieldCheck size={18} /> Admin</Link>
              )}
              <li className="nav-item list-unstyled">
                <Link className="nav-link-premium d-flex align-items-center gap-2" to="/policies"><Shield size={18} /> Plans</Link>
              </li>
              <li className="nav-item list-unstyled">
                <Link className="nav-link-premium d-flex align-items-center gap-2" to="/claims"><Activity size={18} /> Claims</Link>
              </li>
              <button 
                onClick={toggleAdmin}
                className={`btn btn-sm rounded-pill ms-3 px-3 d-flex align-items-center gap-2 ${isAdmin ? 'btn-danger shadow-sm' : 'btn-outline-primary'}`}
              >
                {isAdmin ? <Lock size={14} /> : <Unlock size={14} />} {isAdmin ? 'Logout' : 'Admin Login'}
              </button>
            </div>
          </div>
        </nav>
        <div className="container pb-5">
          <Routes>
            <Route path="/" element={<WorkerDashboard />} />
            <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <div className="p-5 text-center glass-panel"><h3>Access Denied</h3><p className="text-muted">Authorized Admin Hub Personnel Only.</p><Link to="/" className="btn btn-primary rounded-pill px-4 mt-3">Return to Dashboard</Link></div>} />
            <Route path="/policies" element={<PolicyPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
