const express = require('express');
const cors = require('cors');
const path = require('path');
const { createApiRouter } = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', createApiRouter());

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso não encontrado.' });
});

module.exports = app;
