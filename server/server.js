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
    console.error('Error incrementing visitors:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/page-visit', async (req, res) => {
    const { page_path } = req.body;
    if (!page_path) return res.status(400).json({ error: 'Page path is required' });

    try {
        const query = `
            INSERT INTO page_views (page_path, view_count) 
            VALUES ($1, 1) 
            ON CONFLICT (page_path) 
            DO UPDATE SET view_count = page_views.view_count + 1
        `;
        await pool.query(query, [page_path]);
        res.status(200).json({ message: 'Page visit recorded' });
    } catch (error) {
        console.error('Error tracking page:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/page-stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM page_views ORDER BY view_count DESC');
        res.status(200).json(result.rows); 
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/page-visit/single', async (req, res) => {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: 'Path is required' });

    try {
        const result = await pool.query('SELECT view_count FROM page_views WHERE page_path = $1', [path]);
        const count = result.rows.length > 0 ? result.rows[0].view_count : 0;
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching single page stat:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});