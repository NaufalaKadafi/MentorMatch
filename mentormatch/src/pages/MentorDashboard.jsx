import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const MentorDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [mentor, setMentor]     = useState(null);
  const navigate = useNavigate();

  const mentorId   = localStorage.getItem('mentorId');
  const mentorName = localStorage.getItem('mentorName');
  const token      = localStorage.getItem('token');

  useEffect(() => {
    if (!token || localStorage.getItem('role') !== 'mentor') {
      navigate('/login');
      return;
    }
    fetchMentor();
    fetchBookings();
  }, []);

  const fetchMentor = () =>
    fetch(`${API}/mentors/${mentorId}`)
      .then(r => r.json())
      .then(setMentor)
      .catch(() => {});

  const fetchBookings = () =>
    fetch(`${API}/bookings/mentor/${mentorId}`)
      .then(r => r.json())
      .then(setBookings)
      .catch(() => {});

  const updateStatus = async (id, status) => {
    await fetch(`${API}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const pending   = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}>

      {/* TOPBAR */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', borderTop: '3px solid #2563eb', padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#111827', letterSpacing: '-0.5px' }}>
          MENTOR<span style={{ color: '#2563eb' }}>MATCH</span>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500', marginLeft: '10px' }}>Mentor Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>👋 {mentorName}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>Logout</button>
        </div>
      </header>

      <div style={{ padding: '36px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* PROFIL MENTOR */}
        {mentor && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <img src={`/${mentor.image}`} alt={mentor.name} onError={e => e.target.style.display = 'none'}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #dbeafe' }} />
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#111827' }}>{mentor.name}</h2>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>{mentor.skill}</span>
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Rp {mentor.price?.toLocaleString('id-ID')} / sesi</span>
              </div>
            </div>
          </div>
        )}

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
          <StatCard label="Total Booking"  value={bookings.length} color="#2563eb" />
          <StatCard label="Pending"        value={pending}         color="#ca8a04" />
          <StatCard label="Confirmed"      value={confirmed}       color="#16a34a" />
        </div>

        {/* DAFTAR BOOKING */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(90deg, #eff6ff 0%, #fff 60%)' }}>
            <div style={{ width: '4px', height: '20px', background: '#2563eb', borderRadius: '4px' }} />
            <span style={{ fontWeight: '700', color: '#111827' }}>Daftar Booking</span>
          </div>
          <div style={{ padding: '24px' }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Belum ada booking.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                    {['Student', 'Sesi', 'Status', 'Tanggal', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                            {b.student_name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>{b.student_name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontWeight: '700', color: '#111827' }}>{b.sessions}</span>
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}> sesi</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={b.status} /></td>
                      <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(b.created_at).toLocaleString('id-ID')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {b.status !== 'confirmed' && <button onClick={() => updateStatus(b.id, 'confirmed')} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#166534', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700' }}>Confirm</button>}
                          {b.status !== 'cancelled' && <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700' }}>Cancel</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderTop: `3px solid ${color}`, borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `${color}08`, borderRadius: '0 0 0 80px' }} />
    <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{value}</div>
    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '8px', fontWeight: '500' }}>{label}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending:   { bg: '#fefce8', color: '#854d0e', label: 'Pending'   },
    confirmed: { bg: '#f0fdf4', color: '#166534', label: 'Confirmed' },
    cancelled: { bg: '#fef2f2', color: '#991b1b', label: 'Cancelled' },
  };
  const s = map[status] || map.pending;
  return <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700', background: s.bg, color: s.color }}>{s.label}</span>;
};

export default MentorDashboard;
