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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM infographics WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Infographic not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching infographic:', error);
    res.status(500).json({ error: 'Server error while fetching infographic' });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, category } = req.body;
  try {
    const existingInfo = await pool.query('SELECT * FROM infographics WHERE id = $1', [id]);
    if (existingInfo.rows.length === 0) {
      return res.status(404).json({ error: 'Infographic not found' });
    }
    const currentImagePath = existingInfo.rows[0].image_path;
    let newImagePath = currentImagePath;
    if (req.file) {
      newImagePath = `/uploads/${req.file.filename}`;
      if (currentImagePath) {
        const oldImageFullPath = path.join(__dirname, '..', currentImagePath);
        fs.unlink(oldImageFullPath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    }
    const result = await pool.query(
      'UPDATE infographics SET title = $1, category = $2, image_path = $3 WHERE id = $4 RETURNING *',
      [title, category, newImagePath, id]
    );
    res.json({
      message: 'Infographic updated successfully',
      infographic: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating infographic:', error);
    res.status(500).json({ error: 'Server error while updating infographic' });
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

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const existingDoc = await pool.query('SELECT * FROM infographics WHERE id = $1', [id]);
    
    if (existingDoc.rows.length === 0) {
      return res.status(404).json({ error: 'Infographic not found' });
    }

    const filePath = existingDoc.rows[0].file_path;

    await pool.query('DELETE FROM infographics WHERE id = $1', [id]);

    if (filePath) {
      const absolutePath = path.join(__dirname, '..', filePath);
      fs.unlink(absolutePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Failed to delete file from disk:', err);
        }
      });
    }

    res.json({ message: 'Infographic deleted successfully' });
  } catch (error) {
    console.error('Error deleting infographic:', error);
    res.status(500).json({ error: 'Server error while deleting infographic' });
  }
});

module.exports = router;