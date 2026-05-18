require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const documentsRoutes = require('./routes/documents');
const infographicsRoutes = require('./routes/infographics');

const app = express();
app.use(cors());
app.use(express.json()); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');

app.use('/api', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/infographics', infographicsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});