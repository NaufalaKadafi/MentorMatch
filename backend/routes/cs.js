const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customer_service');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, role, whatsapp } = req.body;
  try {
    await db.query('INSERT INTO customer_service (name, role, whatsapp, avatar_seed) VALUES (?, ?, ?, ?)', [name, role, whatsapp, name]);
    res.json({ message: 'CS berhasil ditambahkan!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, role, whatsapp } = req.body;
  try {
    await db.query('UPDATE customer_service SET name=?, role=?, whatsapp=?, avatar_seed=? WHERE id=?', [name, role, whatsapp, name, req.params.id]);
    res.json({ message: 'CS berhasil diupdate!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM customer_service WHERE id=?', [req.params.id]);
    res.json({ message: 'CS berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
