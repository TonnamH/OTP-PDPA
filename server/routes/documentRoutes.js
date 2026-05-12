const express = require('express');
const router = express.Router();

const dummyDocuments = [
    { id: 1, title: 'Document 1', content: 'This is the content of document 1.' },
    { id: 2, title: 'Document 2', content: 'This is the content of document 2.' },
    { id: 3, title: 'Document 3', content: 'This is the content of document 3.' },
];

router.get('/', (req, res) => {
    res.json(dummyDocuments);
});

module.exports = router;