const express = require('express');// Importa o módulo express para criar rotas
const router = express.Router();// Cria uma instância do roteador do Express
const appointmentController = require('../controllers/appointmentController');// Importa o controlador de agendamentos
const protect = require('../middlewares/authMiddleware'); // Importa o middleware de autenticação para proteger rotas

// Rota pública 
router.get('/services', appointmentController.getServices);// Define a rota GET /services que chama o método getServices do controlador de agendamentos para listar todos os serviços disponíveis

// Rotas protegidas 
router.post('/book', protect, appointmentController.createAppointment);// Define a rota POST /book que chama o método createAppointment do controlador de agendamentos para criar um novo agendamento, protegida pelo middleware de autenticação
router.get('/my-books', protect, appointmentController.getMyAppointments);// Define a rota GET /my-books que chama o método getMyAppointments do controlador de agendamentos para listar os agendamentos do usuário logado, protegida pelo middleware de autenticação

module.exports = router;// Exporta o roteador para ser usado em outras partes da aplicação
