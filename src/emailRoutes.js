const express = require('express');
const emailQueue = require('./emailQueue');

const router = express.Router();

router.post('/submit', (req, res) => {
  const { nome, email, assunto, complaint } = req.body;

  emailQueue.add({
    nome,
    email,
    assunto,
    complaint,
  });

  console.log('E-mail adicionado à fila...');

  // res.redirect('/thank-you.html?status=success');
  res.status(200).json({message: "ok"})
});

module.exports = router;
