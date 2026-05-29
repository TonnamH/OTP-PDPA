require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const documentsRoutes = require('./routes/documents');
const infographicsRoutes = require('./routes/infographics');
const ropaRoutes = require('./routes/ropa');
const reportsRoutes = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');

app.use('/api', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/infographics', infographicsRoutes);
app.use('/api/ropa', ropaRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/api/visitors', async (req, res) => {
  try {
    const result = await pool.query('SELECT total_visitors FROM site_statistics WHERE id = 1');
    if (result.rows.length > 0) {
      res.json({ count: result.rows[0].total_visitors });
    } else {
      res.json({ count: 0 });
    }
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/visitors/increment', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE site_statistics SET total_visitors = COALESCE(total_visitors, 0) + 1 WHERE id = 1 RETURNING total_visitors'
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Row not found' });
    }

    res.json({ count: result.rows[0].total_visitors });
  } catch (error) {
    console.error('Error incrementing visitors:', error.message); // <-- add .message
    res.status(500).json({ error: error.message }); // <-- return the actual error
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});