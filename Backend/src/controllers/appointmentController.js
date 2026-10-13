// Bancos de dados em memória
const servicesDatabase = [
  { id: "1", name: "Corte de Cabelo", price: 50.00 },
  { id: "2", name: "Barba Completa", price: 35.00 }
];
const appointmentsDatabase = [];

// Listar todos os serviços disponíveis
exports.getServices = (req, res) => {
  res.json(servicesDatabase);
};

// Criar um novo agendamento (Com validação de horário)
exports.createAppointment = (req, res) => {
  try {
    const { serviceId, dateTime } = req.body;
    const userId = req.user.id; // Pego do token JWT via middleware de segurança

    if (!serviceId || !dateTime) {
      return res.status(400).json({ message: "Por favor, preencha todos os campos." });
    }

    // REGRA DE NEGÓCIO: Verifica se o horário já está ocupado
    const appointmentExists = appointmentsDatabase.find(
      app => app.dateTime === dateTime
    );

    if (appointmentExists) {
      return res.status(400).json({ message: "Desculpe, este horário já está preenchido." });
    }

    // Salva o agendamento se o horário estiver livre
    const newAppointment = {
      id: Date.now().toString(),
      userId,
      serviceId,
      dateTime,
      status: "confirmado"
    };

    appointmentsDatabase.push(newAppointment);
    res.status(201).json({ message: "Agendamento realizado com sucesso!", appointment: newAppointment });

  } catch (error) {
    res.status(500).json({ message: "Erro ao agendar.", error: error.message });
  }
};

// Listar agendamentos do usuário logado
exports.getMyAppointments = (req, res) => {
  const userId = req.user.id;
  const myApps = appointmentsDatabase.filter(app => app.userId === userId);
  res.json(myApps);
};
