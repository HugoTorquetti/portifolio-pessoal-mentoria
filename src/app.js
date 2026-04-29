const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { createApiRouter } = require('./routes/api');
const { openApiDocument } = require('./docs/openapi');

const app = express();

app.use(cors());
app.use(express.json());
app.get('/api-docs.json', (_req, res) => {
  res.status(200).json(openApiDocument);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api', createApiRouter());

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso nao encontrado.' });
});

module.exports = app;
