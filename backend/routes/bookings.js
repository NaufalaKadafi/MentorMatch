const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET semua booking
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT b.*, m.name as mentor_name FROM bookings b JOIN mentors m ON b.mentor_id = m.id ORDER BY b.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET booking per mentor
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM bookings WHERE mentor_id = ? ORDER BY created_at DESC',
      [req.params.mentorId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST booking baru
router.post('/', async (req, res) => {
  const { mentor_id, student_name, sessions } = req.body;
  try {
    await db.query(
      'INSERT INTO bookings (mentor_id, student_name, sessions) VALUES (?, ?, ?)',
      [mentor_id, student_name, sessions]
    );
    res.json({ message: 'Booking berhasil!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE hapus booking
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM bookings WHERE id=?', [req.params.id]);
    res.json({ message: 'Booking berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update status booking
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE bookings SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: 'Status diperbarui!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
