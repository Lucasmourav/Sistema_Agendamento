require('dotenv').config();// Carrega as variáveis de ambiente do arquivo .env
const express = require('express');// Importa o módulo express para criar o servidor
const cors = require('cors');// Importa o módulo cors para permitir requisições de diferentes origens
const authRoutes = require('./src/routes/authRoutes');// Importa as rotas de autenticação
const appointmentRoutes = require('./src/routes/appointmentRoutes');// Importa as rotas de agendamento

const app = express();// Cria uma instância do aplicativo express

// Middlewares obrigatórios
app.use(cors());// Permite requisições de diferentes origens
app.use(express.json());// Permite que o servidor entenda requisições com corpo em JSON

// Rotas da API
app.use('/api/auth', authRoutes);// Define as rotas de autenticação com o prefixo /api/auth
app.use('/api/appointments', appointmentRoutes); // Define as rotas de agendamento com o prefixo /api/appointments

// Rota de teste inicial
app.get('/', (req, res) => {
  res.send('Servidor rodando com sucesso na memória!');
});// Define uma rota de teste na raiz do servidor que retorna uma mensagem de sucesso

// Inicialização do Servidor
const PORT = 5000; // Define a porta do servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));// Inicia o servidor na porta definida e exibe uma mensagem no console

