require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const documentRoutes = require('./routes/documentRoutes');

app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
    res.send('OTP PDPA Server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
