const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/submit', (req, res) => {
  const { nome, email, assunto, complaint } = req.body;

 
  const transporter = nodemailer.createTransport({
    service: 'Outlook365', 
    auth: {
      user: 'daniel.biondi@thomazalves.com.br', 
      pass: '53534125@Pb'                    
    }
  });

  const mailOptions = {
    from: 'daniel.biondi@thomazalves.com.br', 
    to: 'daniel.biondi@thomazalves.com.br',   
    subject: `Nova Solicitação de TI: ${assunto}`,
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #007bff;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nova Solicitação de TI</h1>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${complaint}</p>
          <div class="footer">
            <p>&copy; 2024 Thomaz Alves Advogados. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar o e-mail:', error);
      return res.status(500).send('Erro ao enviar o e-mail.');
    }
    console.log('E-mail enviado:', info.response);
    res.send('Formulário enviado com sucesso!');
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});