const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Receitas da Vó disponível em http://localhost:${PORT}`);
});
