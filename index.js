const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Rota para submissão do formulário
app.post('/submit', (req, res) => {
  const { nome, email, assunto, complaint } = req.body;

  // Configuração do Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Nova Solicitação de TI: ${assunto}`,
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background: #041b33;
            color: #ffffff;
            text-align: center;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            color: #041b33;
            border-radius: 24px;
            padding: 20px;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
            border: 1px solid #041b33;
            position: relative;
            overflow: hidden;
            animation: fadeIn 1s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .container:before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at top left, rgba(4, 27, 51, 0.6), rgba(205, 209, 211, 0.6));
            background-blend-mode: overlay;
            animation: gradientShift 15s ease infinite;
            z-index: -1;
          }
          @keyframes gradientShift {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
          h1 {
            font-weight: 700;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #041b33;
            font-family: 'Poppins', sans-serif;
            letter-spacing: 1px;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
            background: linear-gradient(135deg, #041b33, #003366);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: slideIn 1s ease-out;
          }
          @keyframes slideIn {
            from { transform: translateX(-50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          p {
            font-size: 1.6rem;
            margin: 0.5rem 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 1rem;
            color: #041b33;
            border-top: 2px solid #041b33;
            padding-top: 10px;
            position: relative;
            background: linear-gradient(135deg, rgba(4, 27, 51, 0.1), rgba(205, 209, 211, 0.1));
            overflow: hidden;
          }
          .footer:before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at bottom right, rgba(4, 27, 51, 0.2), rgba(205, 209, 211, 0.2));
            animation: footerWave 20s linear infinite;
            z-index: -1;
          }
          @keyframes footerWave {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 30px;
            background: linear-gradient(135deg, #041b33, #003366);
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.2rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background 0.3s ease, transform 0.3s ease;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .button:hover {
            background: linear-gradient(135deg, #002d50, #001f3f);
            transform: translateY(-2px);
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
            <a href="mailto:${process.env.EMAIL_USER}" class="button">Responder</a>
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

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
