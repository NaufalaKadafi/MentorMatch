const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET semua mentor
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mentors');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mentors WHERE id=?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Mentor tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah mentor
router.post('/', async (req, res) => {
  const { name, skill, price, image, whatsapp } = req.body;
  try {
    await db.query(
      'INSERT INTO mentors (name, skill, price, image, whatsapp) VALUES (?, ?, ?, ?, ?)',
      [name, skill, price, image, whatsapp]
    );
    res.json({ message: 'Mentor berhasil ditambahkan!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT edit mentor
router.put('/:id', async (req, res) => {
  const { name, skill, price, image, whatsapp } = req.body;
  try {
    await db.query(
      'UPDATE mentors SET name=?, skill=?, price=?, image=?, whatsapp=? WHERE id=?',
      [name, skill, price, image, whatsapp, req.params.id]
    );
    res.json({ message: 'Mentor berhasil diupdate!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE hapus mentor
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM mentors WHERE id=?', [req.params.id]);
    res.json({ message: 'Mentor berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
