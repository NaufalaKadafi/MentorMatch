import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Coba login admin dulu
    try {
      const res  = await fetch('https://respectful-benevolence-production-5f4e.up.railway.app/api/auth/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'admin');
        navigate('/admin');
        return;
      }
    } catch {}

    // Kalau bukan admin, coba login mentor
    try {
      const res  = await fetch('https://respectful-benevolence-production-5f4e.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'mentor');
        localStorage.setItem('mentorId', data.id);
        localStorage.setItem('mentorName', data.name);
        navigate('/mentor-dashboard');
        return;
      }
      setError(data.error || 'Login gagal.');
    } catch {
      setError('Tidak bisa terhubung ke server.');
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '48px 40px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontWeight: '900', fontSize: '1.5rem', color: '#111827', letterSpacing: '-0.5px' }}>
            MENTOR<span style={{ color: '#2563eb' }}>MATCH</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '8px' }}>Login untuk mengakses dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>Nomor WhatsApp</label>
            <input
              type="text"
              placeholder="628..."
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              required
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
