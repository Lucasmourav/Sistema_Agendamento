require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes'); 

const app = express();

// Middlewares obrigatórios
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes); 

// Rota de teste inicial
app.get('/', (req, res) => {
  res.send('🚀 Servidor rodando com sucesso na memória!');
});

// Inicialização do Servidor
const PORT = 5000; 
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

