const Bull = require('bull');
const nodemailer = require('nodemailer');
const redisClient = require('./redis');
require('dotenv').config()
const emailQueue = new Bull('emailQueue', { redis: redisClient });

emailQueue.process(async (job) => {
  const { nome, email, assunto, complaint } = job.data;
  console.log(process.env.EMAIL_USER)
  const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "yudisakuma@gmail.com",
    subject: `Suporte TI: ${assunto}`,
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #333;
            text-align: center;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            color: #333;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
            position: relative;
            overflow: hidden;
          }
          .header {
            background: #ffffff;
            padding: 10px 0;
          }
          .header img {
            max-width: 100%;
            height: auto;
            border-radius: 12px 12px 0 0;
            border-bottom: 4px solid #041b33;
          }
          h1 {
            font-weight: 700;
            font-size: 2.5rem;
            margin: 1rem 0;
            color: #041b33;
            font-family: 'Poppins', sans-serif;
            letter-spacing: 1px;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
            background: linear-gradient(135deg, #041b33, #041b33);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1.5rem;
          }
          p {
            font-size: 1.2rem;
            margin: 0.5rem 0;
            line-height: 1.5;
          }
          .footer {
            margin-top: 20px;
            font-size: 1rem;
            color: #041b33;
            border-top: 2px solid #041b33;
            padding: 10px 0;
            position: relative;
            background: #ffffff;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 30px;
            background: #041b33;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.2rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: background 0.3s ease, transform 0.3s ease;
          }
          .button:hover {
            background: #003366;
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://app.tangerino.com.br/Tangerino/pages/image?banner=14727" alt="Banner">
          </div>
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
});

module.exports = emailQueue;
