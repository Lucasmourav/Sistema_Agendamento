const express = require('express');// Importa o módulo express para criar rotas
const router = express.Router();// Cria uma instância do roteador do Express
const authController = require('../controllers/authController');// Importa o controlador de autenticação

router.post('/register', authController.register);// Define a rota POST /register que chama o método register do controlador de autenticação para registrar um novo usuário
router.post('/login', authController.login);// Define a rota POST /login que chama o método login do controlador de autenticação para autenticar um usuário existente

module.exports = router;// Exporta o roteador para ser usado em outras partes da aplicação
 