const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM documents ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Server error while fetching documents' });
    }
});

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      'INSERT INTO documents (title, category, file_path, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, category, filePath, req.admin.id]
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: result.rows[0]
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

module.exports = router;