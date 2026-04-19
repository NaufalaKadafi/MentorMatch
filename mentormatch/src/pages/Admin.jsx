import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';
const emptyForm   = { name: '', skill: '', price: '', image: '', whatsapp: '' };
const emptyCsForm = { name: '', role: '', whatsapp: '' };

const Admin = () => {
  const [tab, setTab]             = useState('dashboard');
  const [bookings, setBookings]   = useState([]);
  const [mentors, setMentors]     = useState([]);
  const [csList, setCsList]       = useState([]);
  const [form, setForm]           = useState(emptyForm);
  const [csForm, setCsForm]       = useState(emptyCsForm);
  const [editId, setEditId]       = useState(null);
  const [csEditId, setCsEditId]   = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);

  useEffect(() => { fetchBookings(); fetchMentors(); fetchCs(); }, []);

  const fetchBookings = () =>
    fetch(`${API}/bookings`).then(r => r.json()).then(setBookings).catch(() => {});

  const fetchMentors = () =>
    fetch(`${API}/mentors`).then(r => r.json()).then(setMentors).catch(() => {});

  const fetchCs = () =>
    fetch(`${API}/cs`).then(r => r.json()).then(setCsList).catch(() => {});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageName = form.image;
    if (imageFile) {
      const fd = new FormData();
      fd.append('image', imageFile);
      const uploadRes  = await fetch(`${API}/upload`, { method: 'POST', body: fd });
      const uploadData = await uploadRes.json();
      if (uploadData.error) return alert('Gagal upload gambar.');
      imageName = uploadData.filename;
    }
    const url    = editId ? `${API}/mentors/${editId}` : `${API}/mentors`;
    const method = editId ? 'PUT' : 'POST';
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, image: imageName }) });
    const data   = await res.json();
    alert(data.message);
    setForm(emptyForm); setEditId(null); setImageFile(null); setPreview(null);
    fetchMentors();
  };

  const handleEdit = (mentor) => {
    setEditId(mentor.id);
    setForm({ name: mentor.name, skill: mentor.skill, price: String(mentor.price), image: mentor.image, whatsapp: mentor.whatsapp });
    setPreview(null); setImageFile(null);
    setTab('mentors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus mentor ini?')) return;
    const res  = await fetch(`${API}/mentors/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message);
    fetchMentors();
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  };

  const deleteBooking = async (id) => {
    if (!confirm('Yakin hapus riwayat booking ini?')) return;
    await fetch(`${API}/bookings/${id}`, { method: 'DELETE' });
    fetchBookings();
  };

  const pending   = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;

  const handleCsSubmit = async (e) => {
    e.preventDefault();
    const url    = csEditId ? `${API}/cs/${csEditId}` : `${API}/cs`;
    const method = csEditId ? 'PUT' : 'POST';
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(csForm) });
    const data   = await res.json();
    alert(data.message);
    setCsForm(emptyCsForm); setCsEditId(null);
    fetchCs();
  };

  const handleCsEdit = (cs) => {
    setCsEditId(cs.id);
    setCsForm({ name: cs.name, role: cs.role, whatsapp: cs.whatsapp });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCsDelete = async (id) => {
    if (!confirm('Yakin hapus CS ini?')) return;
    const res  = await fetch(`${API}/cs/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message);
    fetchCs();
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'bookings',  label: 'Daftar Booking' },
    { key: 'mentors',   label: 'Manage Mentor' },
    { key: 'cs',        label: 'Manage CS' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width: '230px', background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontWeight: '900', fontSize: '1.25rem', color: '#111827', letterSpacing: '-0.5px' }}>
            MENTOR<span style={{ color: '#2563eb' }}>MATCH</span>
          </span>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>Admin Panel</div>
        </div>
        <nav style={{ padding: '12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} style={{
              padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              textAlign: 'left', fontWeight: tab === item.key ? '600' : '500', fontSize: '0.875rem', width: '100%',
              background: tab === item.key ? '#eff6ff' : 'transparent',
              color: tab === item.key ? '#2563eb' : '#6b7280',
              borderLeft: tab === item.key ? '3px solid #2563eb' : '3px solid transparent',
              transition: 'all 0.15s',
            }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px 24px', borderTop: '1px solid #f3f4f6', fontSize: '0.75rem', color: '#d1d5db' }}>
          © 2025 MentorMatch
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* TOPBAR */}
        <header style={{ padding: '20px 36px', background: '#fff', borderBottom: '1px solid #e5e7eb', borderTop: '3px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#111827' }}>
            {navItems.find(n => n.key === tab)?.label}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {pending > 0 && (
              <div style={{ background: '#fef9c3', border: '1px solid #fde047', color: '#854d0e', padding: '5px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' }}>
                ⏳ {pending} pending
              </div>
            )}
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700' }}>A</div>
          </div>
        </header>

        <div style={{ padding: '36px', flex: 1 }}>

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <StatCard label="Total Mentor"  value={mentors.length}  color="#2563eb" />
                <StatCard label="Total Booking" value={bookings.length} color="#2563eb" />
                <StatCard label="Confirmed"     value={confirmed}       color="#16a34a" />
                <StatCard label="Pending"       value={pending}         color="#ca8a04" />
              </div>

              <Card title="Booking Terbaru" subtitle={`${bookings.length} total`}>
                {bookings.length === 0
                  ? <Empty />
                  : <BookingTable rows={bookings.slice(0, 5)} onStatus={updateStatus} onDelete={deleteBooking} compact />
                }
              </Card>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {tab === 'bookings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { label: `Semua (${bookings.length})`,   color: '#2563eb', bg: '#eff6ff' },
                  { label: `Pending (${pending})`,         color: '#ca8a04', bg: '#fefce8' },
                  { label: `Confirmed (${confirmed})`,     color: '#16a34a', bg: '#f0fdf4' },
                  { label: `Cancelled (${cancelled})`,     color: '#dc2626', bg: '#fef2f2' },
                ].map(p => (
                  <div key={p.label} style={{ padding: '6px 16px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', background: p.bg, color: p.color }}>
                    {p.label}
                  </div>
                ))}
              </div>
              <Card title="Semua Booking">
                {bookings.length === 0 ? <Empty /> : <BookingTable rows={bookings} onStatus={updateStatus} onDelete={deleteBooking} />}
              </Card>
            </div>
          )}

          {/* ── MENTORS ── */}
          {tab === 'mentors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <Card title={editId ? 'Edit Mentor' : 'Tambah Mentor'}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[['name','Nama Mentor'],['skill','Keahlian'],['price','Harga (Rp)'],['whatsapp','Nomor WhatsApp']].map(([key, label]) => (
                    <div key={key}>
                      <label style={labelSt}>{label}</label>
                      <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        placeholder={label} required style={inputSt} />
                    </div>
                  ))}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelSt}>Foto Mentor</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ ...inputSt, padding: '9px' }} />
                    {preview && <img src={preview} alt="preview" style={imgThumb} />}
                    {!preview && form.image && <img src={`/${form.image}`} alt="current" style={imgThumb} />}
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={btnPrimary}>{editId ? 'Simpan Perubahan' : 'Tambah Mentor'}</button>
                    {editId && <button type="button" onClick={() => { setForm(emptyForm); setEditId(null); setPreview(null); setImageFile(null); }} style={btnSecondary}>Batal</button>}
                  </div>
                </form>
              </Card>

              <Card title="Daftar Mentor" subtitle={`${mentors.length} mentor`}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                      {['Mentor','Keahlian','Harga','WhatsApp','Aksi'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mentors.map((m, i) => (
                      <tr key={m.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={`/${m.image}`} alt={m.name} onError={e => e.target.style.display='none'}
                              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #dbeafe' }} />
                            <div>
                              <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>{m.name}</div>
                              <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>ID #{m.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap' }}>{m.skill}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: '#111827', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Rp {m.price.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.85rem' }}>{m.whatsapp}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEdit(m)} style={btnEdit}>Edit</button>
                            <button onClick={() => handleDelete(m.id)} style={btnDel}>Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* ── CS ── */}
          {tab === 'cs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <Card title={csEditId ? 'Edit CS' : 'Tambah CS'}>
                <form onSubmit={handleCsSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[['name','Nama'],['role','Role'],['whatsapp','Nomor WhatsApp']].map(([key, label]) => (
                    <div key={key}>
                      <label style={labelSt}>{label}</label>
                      <input value={csForm[key]} onChange={e => setCsForm({ ...csForm, [key]: e.target.value })}
                        placeholder={label} required style={inputSt} />
                    </div>
                  ))}
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={btnPrimary}>{csEditId ? 'Simpan Perubahan' : 'Tambah CS'}</button>
                    {csEditId && <button type="button" onClick={() => { setCsForm(emptyCsForm); setCsEditId(null); }} style={btnSecondary}>Batal</button>}
                  </div>
                </form>
              </Card>

              <Card title="Daftar Customer Service" subtitle={`${csList.length} CS`}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                      {['Nama','Role','WhatsApp','Aksi'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csList.map((cs, i) => (
                      <tr key={cs.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cs.avatar_seed}`} alt={cs.name}
                              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #dbeafe' }} />
                            <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>{cs.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>{cs.role}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '0.85rem' }}>{cs.whatsapp}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleCsEdit(cs)} style={btnEdit}>Edit</button>
                            <button onClick={() => handleCsDelete(cs.id)} style={btnDel}>Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

/* ── SUB COMPONENTS ── */

const StatCard = ({ label, value, color }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderTop: `3px solid ${color}`, borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `${color}08`, borderRadius: '0 0 0 80px' }} />
    <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{value}</div>
    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '8px', fontWeight: '500' }}>{label}</div>
  </div>
);

const Card = ({ title, subtitle, children }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
    <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, #eff6ff 0%, #fff 60%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '4px', height: '20px', background: '#2563eb', borderRadius: '4px' }} />
        <span style={{ fontWeight: '700', color: '#111827' }}>{title}</span>
      </div>
      {subtitle && <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{subtitle}</div>}
    </div>
    <div style={{ padding: '24px' }}>{children}</div>
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

const BookingTable = ({ rows, onStatus, onDelete, compact }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
        {['Student', 'Mentor', 'Sesi', 'Status', ...(!compact ? ['Aksi'] : []), 'Tanggal'].map(h => (
          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((b) => (
        <tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
          <td style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0 }}>
                {b.student_name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>{b.student_name}</span>
            </div>
          </td>
          <td style={{ padding: '14px 16px' }}>
            <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>{b.mentor_name}</span>
          </td>
          <td style={{ padding: '14px 16px' }}>
            <span style={{ fontWeight: '700', color: '#111827' }}>{b.sessions}</span>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}> sesi</span>
          </td>
          <td style={{ padding: '14px 16px' }}><StatusBadge status={b.status} /></td>
          {!compact && (
            <td style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {b.status !== 'confirmed' && <button onClick={() => onStatus(b.id, 'confirmed')} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#166534', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700' }}>Confirm</button>}
                {b.status !== 'cancelled' && <button onClick={() => onStatus(b.id, 'cancelled')} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700' }}>Cancel</button>}
                <button onClick={() => onDelete(b.id)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700' }}>Hapus</button>
              </div>
            </td>
          )}
          <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(b.created_at).toLocaleString('id-ID')}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Empty = () => <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Belum ada data.</div>;

/* ── STYLES ── */
const labelSt    = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#374151' };
const inputSt    = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#fff', color: '#111827', boxSizing: 'border-box', fontSize: '0.875rem' };
const imgThumb   = { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #dbeafe', marginTop: '12px' };
const btnBase    = { padding: '11px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.875rem' };
const btnPrimary = { ...btnBase, background: '#2563eb', color: '#fff' };
const btnSecondary = { ...btnBase, background: '#f3f4f6', color: '#374151' };
const btnEdit    = { padding: '7px 14px', borderRadius: '8px', border: '1px solid #dbeafe', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' };
const btnDel     = { padding: '7px 14px', borderRadius: '8px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' };

export default Admin;
