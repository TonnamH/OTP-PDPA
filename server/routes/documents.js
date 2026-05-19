const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM documents WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Server error while fetching document' });
  }
});

router.put('/:id', auth, upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const { title, category } = req.body;

  try {
    const existingDoc = await pool.query('SELECT * FROM documents WHERE id = $1', [id]);
    if (existingDoc.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const currentFilePath = existingDoc.rows[0].file_path;

    let newFilePath = currentFilePath;

    if (req.file) {
      newFilePath = `/uploads/${req.file.filename}`;
      if (currentFilePath) {
        const oldFileAbsolutePath = path.join(__dirname, '..', currentFilePath);

        fs.unlink(oldFileAbsolutePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Failed to delete old file:', err);
          }
        });
      }
    }

    const result = await pool.query(
      'UPDATE documents SET title = $1, category = $2, file_path = $3 WHERE id = $4 RETURNING *',
      [title, category, newFilePath, id]
    );

    res.json({
      message: 'Document updated successfully',
      document: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Server error while updating document' });
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

// DELETE a document
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const existingDoc = await pool.query('SELECT * FROM documents WHERE id = $1', [id]);
    
    if (existingDoc.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = existingDoc.rows[0].file_path;

    await pool.query('DELETE FROM documents WHERE id = $1', [id]);

    if (filePath) {
      const absolutePath = path.join(__dirname, '..', filePath);
      fs.unlink(absolutePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Failed to delete file from disk:', err);
        }
      });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Server error while deleting document' });
  }
});

module.exports = router;