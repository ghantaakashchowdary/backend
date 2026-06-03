import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

function Admin() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await API.get('/api/auth/admin');
        setMessage(response.data?.message || 'Welcome Admin');
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || 
          err.response?.data?.error || 
          'Access Denied: You do not have admin permissions.'
        );
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Navigation */}
      <nav className="navbar">
        <Link to="/dashboard" className="navbar-brand">
          TaskStream
        </Link>
        <div className="navbar-actions">
          <Link to="/dashboard" className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}>
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="admin-card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div className="admin-icon" style={{ color: 'var(--danger)' }}>⚠️</div>
            <h1 className="admin-title" style={{ background: 'linear-gradient(135deg, #ffffff, #fca5a5)' }}>Access Denied</h1>
            <p className="admin-subtitle">{error}</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ width: 'auto', margin: '0 auto' }}>
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="admin-card">
            <div className="admin-icon">👑</div>
            <h1 className="admin-title">Welcome Admin</h1>
            <p className="admin-subtitle">
              {message || 'You have successfully verified your administrator credentials.'}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/dashboard" className="btn btn-secondary" style={{ width: 'auto' }}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
