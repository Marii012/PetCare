const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./database/database-remote');

// Modelos
const User = require('./models/userModel');
const Species = require('./models/speciesModel');
const Breed = require('./models/breedModel');
const ContactReason = require('./models/contactReasonModel');
const Contact = require('./models/contactModel');


// Associações
require('./models/associations');


// Rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const speciesRoutes = require('./routes/speciesRoutes');
const breedRoutes = require('./routes/breedRoutes');
const contactReasonRoutes = require('./routes/contactReasonRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// ==========================================
// MIDDLEWARES GERAIS
// ==========================================
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ==========================================
// REGISTO DAS ROTAS DA API (Sempre ANTES dos erros)
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "Online",
    message: "Bem-vindo à API da VetLumen!" 
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/species', speciesRoutes);

app.use('/api/breeds', breedRoutes);

app.use('/api/contact-reasons', contactReasonRoutes);

app.use('/api/contacts', contactRoutes);

// ==========================================
// TRATAMENTO DE ERROS (Apenas DEPOIS de tentar todas as rotas acima)
// ==========================================

// 1. Rota Fallback para Endpoints não encontrados (404)
app.use((req, res, next) => {
  const error = new Error(`Não foi possível encontrar a rota ${req.originalUrl} neste servidor.`);
  res.status(404);
  next(error); 
});

// 2. Middleware Global de Tratamento de Erros (Catch-All)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`Erro detetado [${req.method} ${req.url}]:`, err.message);
  
  res.status(statusCode).json({
    status: "Error",
    message: err.message || 'Ocorreu um problema inesperado no servidor.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR E BASE DE DADOS
// ==========================================
const PORT = process.env.PORT || 3000;

// O bloco condicional impede o app.listen de bloquear ou duplicar portas durante o ambiente de testes
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ force: false })
    .then(() => {
      console.log('✅ Conexão com o Neon PostgreSQL validada com sucesso.');
      
      app.listen(PORT, () => {
        console.log(`🚀 Servidor backend a correr na porta ${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ Erro ao ligar à Base de Dados (Neon):', err);
      process.exit(1); 
    });
} else {
  // Em ambiente de teste, apenas sincroniza a base de dados sem abrir a porta web repetidamente
  sequelize.sync({ force: false }).catch(err => console.error('Erro no sync de teste:', err));
}

module.exports = app;