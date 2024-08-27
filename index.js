const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const emailRoutes = require('./src/emailRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.use('/api', emailRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
