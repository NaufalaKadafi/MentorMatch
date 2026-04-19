import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import About from './pages/About';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import './App.css';
import License from './pages/License';
import Admin from './pages/Admin';
import Login from './pages/Login';
import MentorDashboard from './pages/MentorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="*" element={
          <>
            <Navbar />
            <div className="main-content" style={{ minHeight: '80vh' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/about" element={<About />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/license" element={<License />} />
              </Routes>
            </div>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;