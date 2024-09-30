const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');  // Módulo para lidar com caminhos de arquivos
require('dotenv').config();  // Carregar variáveis de ambiente de um arquivo .env

const app = express();

// Variável para armazenar o número do ticket
let ticketNumber = 0;  // Começa com zero, e será incrementado a cada envio

// Servir arquivos estáticos (CSS, JS, imagens) a partir da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Servir a pasta pastaconfirmacao como estática
app.use('/pastaconfirmacao', express.static(path.join(__dirname, 'pastaconfirmacao')));

// Configurar body-parser para processar o formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Servir o arquivo index.html quando acessar a rota raiz "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para servir a página de confirmação
app.get('/confirmacao/:ticketId', (req, res) => {
    const ticketId = req.params.ticketId; // Pegar o número do ticket enviado na URL
    res.sendFile(path.join(__dirname, 'pastaconfirmacao', 'confirmacao.html'));
});

// Configurar o transporte de e-mail usando autopremiergpt@gmail.com
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,  // O e-mail para envio, carregado do arquivo .env
        pass: process.env.GMAIL_PASS   // A senha de aplicativo do Gmail, carregada do arquivo .env
    }
});

// Rota para processar o formulário e enviar o e-mail
app.post('/send-email', (req, res) => {
    const { name, email, issue } = req.body;

    // Incrementar o número do ticket
    ticketNumber++;

    // Configurar as opções do e-mail
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'suporte.ti@autopremier.com.br',
        subject: `Novo ticket de suporte de ${name}`,  // Assunto do e-mail
        text: `Ticket Número: #${ticketNumber}\nNome: ${name}\nE-mail: ${email}\nDescrição do Problema: ${issue}`
    };

    // Enviar o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar o e-mail:', error);
            return res.status(500).send('Erro ao enviar o e-mail.');
        } else {
            console.log('E-mail enviado: ' + info.response);
            // Redirecionar para a página de confirmação com o número do ticket
            return res.redirect(`/confirmacao/${ticketNumber}`);
        }
    });
});

// Iniciar o servidor na porta 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
