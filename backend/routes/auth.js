const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const SECRET = process.env.JWT_SECRET || 'mentormatch_secret';

// LOGIN MENTOR
router.post('/login', async (req, res) => {
  const { whatsapp, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM mentors WHERE whatsapp = ?', [whatsapp]);
    if (rows.length === 0) return res.status(401).json({ error: 'Nomor WA tidak ditemukan.' });

    const mentor = rows[0];
    if (!mentor.password) return res.status(401).json({ error: 'Akun belum punya password.' });

    const valid = await bcrypt.compare(password, mentor.password);
    if (!valid) return res.status(401).json({ error: 'Password salah.' });

    const token = jwt.sign({ id: mentor.id, role: 'mentor', name: mentor.name }, SECRET, { expiresIn: '7d' });
    res.json({ token, role: 'mentor', name: mentor.name, id: mentor.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ADMIN
router.post('/login-admin', async (req, res) => {
  const { whatsapp, password } = req.body;
  try {
    const adminWa   = process.env.ADMIN_WA;
    const adminPass = process.env.ADMIN_PASS;

    if (whatsapp !== adminWa) return res.status(401).json({ error: 'Nomor WA tidak ditemukan.' });

    const valid = password === adminPass;
    if (!valid) return res.status(401).json({ error: 'Password salah.' });

    const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '7d' });
    res.json({ token, role: 'admin' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
