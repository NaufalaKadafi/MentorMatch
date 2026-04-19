const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../mentormatch/public/'),
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Tidak ada file.' });
  res.json({ filename: req.file.filename });
});

module.exports = router;
