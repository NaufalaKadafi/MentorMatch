import React, { useState, useEffect } from 'react';
import MentorCard from '../components/MentorCard';

const Explore = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('https://respectful-benevolence-production-5f4e.up.railway.app/api/mentors')
      .then(res => res.json())
      .then(data => setMentors(data))
      .catch(err => console.error('Gagal fetch mentor:', err));
  }, []);

  const handleOpenModal = (mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
  };

  return (
    <div className="explore-container">
      <header className="explore-header">
        <div className="about-badge">Our Mentors</div>
        <h2>Temukan Mentor Terbaikmu</h2>
        <p>Belajar langsung dari 12 senior berpengalaman di bidangnya.</p>
      </header>

      <div className="mentor-grid">
        {mentors.map(mentor => (
          <MentorCard 
            key={mentor.id} 
            mentor={mentor} 
            onBookingClick={handleOpenModal} 
          />
        ))}
      </div>

      {/* MODAL BOOKING POP-UP */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            <h2>Booking Mentor</h2>
            <p style={{marginBottom: '20px'}}>Anda akan memesan sesi dengan <strong>{selectedMentor.name}</strong></p>
            
            <form className="booking-form" onSubmit={async (e) => {
              e.preventDefault();
              const studentName = e.target[0].value;
              const sessions    = e.target[1].value;
              try {
                const res = await fetch('https://respectful-benevolence-production-5f4e.up.railway.app/api/bookings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    mentor_id:    selectedMentor.id,
                    student_name: studentName,
                    sessions:     sessions,
                  }),
                });
                const data = await res.json();
                alert(data.message || 'Booking berhasil!');
              } catch (err) {
                alert('Gagal booking, coba lagi.');
              }
              handleCloseModal();
            }}>
              <label>Nama Lengkap</label>
              <input type="text" placeholder="Masukkan nama Anda" required />

              <label>Berapa sesi yang ingin dipesan?</label>
              <input type="number" min="1" placeholder="Contoh: 3" required />

              <button type="submit" className="btn-submit">Kirim Permintaan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;