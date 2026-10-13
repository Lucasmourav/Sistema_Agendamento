const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const protect = require('../middlewares/authMiddleware'); // Importa a trava

// Rota pública 
router.get('/services', appointmentController.getServices);

// Rotas protegidas 
router.post('/book', protect, appointmentController.createAppointment);
router.get('/my-books', protect, appointmentController.getMyAppointments);

module.exports = router;
