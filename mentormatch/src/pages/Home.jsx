import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Data untuk subjects yang akan bergerak
  const subjects = [
    { i: 'π', n: 'Math' }, { i: '🧪', n: 'Chemistry' }, { i: '💻', n: 'Coding' },
    { i: '📝', n: 'SAT' }, { i: 'ض', n: 'Arabic' }, { i: '🗣️', n: 'Public Speaking' },
    { i: '🌍', n: 'Social Science' }, { i: '🧬', n: 'Biology' }
  ];

  return (
    <div className="home-wrapper">
      {/* SECTION 1: HERO */}
<header className="hero">
  <h1>Find your perfect <span>Mentor Match.</span></h1>
  <p>Hubungkan dirimu dengan bimbingan satu-lawan-satu yang dipersonalisasi.</p>
  <div className="hero-btns">
    {/* Link langsung ke Explore */}
    <Link to="/explore" className="btn-primary">Get Started</Link>
  </div>
</header>

      {/* SECTION 2: MOVING SUBJECTS (Infinite Scroll) */}
      <section className="scroll-container">
        <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Get help with all your school subjects</h2>
        <div className="scroll-track">
          {/* Kita duplikasi agar looping tidak terputus */}
          {[...subjects, ...subjects].map((s, index) => (
            <div key={index} className="subj-item">
              <i>{s.i}</i>
              <p>{s.n}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: 3-STEP FORMULA (Gambar 1) */}
      <section className="formula-section">
        <h2>Our 3-Step Formula for A+ Success!</h2>
        <div className="formula-grid">
          <FormulaCard step="1" icon="📊" title="Personalized Plan" bg="#dbeafe" />
          <FormulaCard step="2" icon="👨‍🏫" title="High-Impact 1:1" bg="#dcfce7" />
          <FormulaCard step="3" icon="📈" title="Stay Involved" bg="#fef9c3" />
        </div>
      </section>

      {/* SECTION 4: EDUCATORS */}
<section className="educators-section">
  <h2>Educators Committed to Your Growth</h2>
  <div className="video-grid">
    {/* Ganti /videos/hero.mp4 dengan nama file videomu yang ada di folder public/videos/ */}
    <VideoCard 
      name="temereks anaks DKV RJ45 and sisikumalasisi palak siring" 
      info="Math Educator, 1+ Month" 
      videoSrc={`${import.meta.env.BASE_URL}videos/hero-video1.mp4`}
    />
    <VideoCard
      name="paris anak gadis mannak kesayangan ibu-ibu"
      info="English Educator, 2+ Weeks"
      videoSrc={`${import.meta.env.BASE_URL}videos/hero-video2.mp4`}
    />
    <VideoCard
      name="rayyanza queenzy (ADMIN)"
      info="Database Specialist, 1+ Years"
      videoSrc={`${import.meta.env.BASE_URL}videos/hero-video3.mp4`}
    />
  </div>
</section>

      {/* SECTION 5: REVIEWS (Gambar 3) */}
      <section className="review-section">
        <h2>Here's What Parents Are Saying</h2>
        <div style={{marginBottom: '30px'}}>
          <strong>4.9 ⭐⭐⭐⭐⭐</strong> <span>171 reviews on Google</span>
          <br />
          <a href="https://maps.app.goo.gl/j41B96xuBk5Z3sdS6" target="_blank" style={{color: '#2563eb', fontWeight: 'bold'}}>📍 View on map</a>
        </div>
        <div className="review-grid">
          <ReviewCard text="Ms. Temereks dan Sisikumalasisi benar-benar sangat pandai dalam mengajar matematika. walaupun anak saya sering kali mengeluh bahwa semua yang mereka ajarkan tidak pernah dipakai dalam pelajaran anak kelas 4 SD. anak saya mengaku bahwa dia hanya diajarkan bagaimana cara yang baik dan benar dalam menghitung bobot sawit dengan nilai pasaran saat ini, tapi tidak apa saya puas." author="bapak Hermensius" />
          <ReviewCard text="mr. paris begitu bijak dalam mengajar dan sangat konsisten serta sabar, kebetulan anak saya sedang mengikuti tes untuk mengambil doktor dan anak saya alhamdulillah setelah diajar oleh mr. paris sekarang dia sudah bisa berpidato selayaknya pemimpin negara 'we wok de tok, not onli tok de tok' terima kasih banyak mr. paris" author="Dian ******" />
          <ReviewCard text="saya bersyukur memiliki guru seperti mr. rayyanza, beliau mengajarkan saya bagaimana cara mengerjakan database dengan metode slow living, yaitu dikerjakan saat h-1 dikumpulkan, sehingga database tidak sempat dimasukkan ke dalam laporan, tapi metode itu sangatlah bijak dan cerdas, aku cinta mr. rayyanza" author="Sulthon Dzaki" />
        </div>
      </section>

      {/* SECTION 6: SUCCESS STORIES (Gambar 4 - WA Style) */}
      <section className="success-stories">
        <h2>Success Stories</h2>
        <div className="wa-grid">
          <div className="wa-bubble">💬 "Anakku berhasil masuk OXFORD UNIVERSITY!!!"</div>
          <div className="wa-bubble">💬 "Anakku telah menjadi public speaker yang hebat!"</div>
          <div className="wa-bubble">💬 "Aku berhasil diterima di perusahaaan APPLE!"</div>
        </div>
      </section>
    </div>
  );
};

// Komponen Pembantu
const FormulaCard = ({ step, icon, title, bg }) => (
  <div className="formula-card">
    <span className="step-tag">{step}</span>
    <div className="formula-img" style={{ background: bg }}>{icon}</div>
    <h3>{title}</h3>
    <p>Identify learning gaps with AI and tackle them with a personalized plan.</p>
  </div>
);

const VideoCard = ({ name, info, videoSrc }) => (
  <div className="v-card">
    <div className="v-thumb" style={{ padding: '0', overflow: 'hidden', background: '#000' }}>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      >
        <source src={videoSrc} type="video/mp4" />
        Browser tidak mendukung video.
      </video>
    </div>
    <h4>{name}</h4>
    <p style={{color: '#6b7280', fontSize: '0.9rem'}}>{info}</p>
  </div>
);

const ReviewCard = ({ text, author }) => (
  <div className="r-card">
    <p style={{fontStyle: 'italic', marginBottom: '15px'}}>"{text}"</p>
    <strong>- {author}</strong>
  </div>
);

export default Home;