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
    cb(null, 'info-' + uniqueSuffix + path.extname(file.originalname)); 
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM infographics ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching infographics:', error);
        res.status(500).json({ error: 'Server error while fetching infographics' });
    }
});

router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded or invalid file type.' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    
    const result = await pool.query(
      'INSERT INTO infographics (title, category, image_path, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, category, imagePath, req.admin.id]
    );

    res.status(201).json({
      message: 'Infographic uploaded successfully',
      infographic: result.rows[0]
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

module.exports = router;