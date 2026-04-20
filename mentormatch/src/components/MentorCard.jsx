import React from 'react';

const MentorCard = ({ mentor, onBookingClick }) => {
  // Format pesan WhatsApp agar rapi di URL
  const waMessage = encodeURIComponent("Hai, saya ingin memesan anda sebagai mentor saya dari MentorMatch!");
  const waLink = `https://wa.me/${mentor.whatsapp}?text=${waMessage}`;

  return (
    <div className="m-card">
      <img src={`${import.meta.env.BASE_URL}${mentor.image}`} alt={mentor.name} className="mentor-img" />
      <div className="m-info">
        <h3>{mentor.name}</h3>
        <span className="m-skill">{mentor.skill}</span>
        <p className="m-price">Rp {mentor.price.toLocaleString('id-ID')} <span>/ sesi</span></p>
        
        <div className="card-buttons">
          <button className="btn-book-now" onClick={() => onBookingClick(mentor)}>
            Booking
          </button>
          
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-contact-wa">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;