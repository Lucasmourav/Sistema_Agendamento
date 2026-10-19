// Bancos de dados em memória
const servicesDatabase = [
  { id: "1", name: "Corte de Cabelo", price: 50.00 },// Um array simples para armazenar os serviços disponíveis
  { id: "2", name: "Barba Completa", price: 35.00 }// Um array simples para armazenar os serviços disponíveis
];// Um array simples para armazenar os serviços disponíveis
const appointmentsDatabase = [];// Um array simples para armazenar os agendamentos realizados

// Listar todos os serviços disponíveis
exports.getServices = (req, res) => {
  res.json(servicesDatabase);// Retorna a lista de serviços disponíveis em formato JSON
};// Retorna a lista de serviços disponíveis em formato JSON

// Criar um novo agendamento (Com validação de horário)
exports.createAppointment = (req, res) => {
  try {
    const { serviceId, dateTime } = req.body;// Recebe do body: serviceId e dateTime
    const userId = req.user.id; // Pego do token JWT via middleware de segurança

    if (!serviceId || !dateTime) {
      return res.status(400).json({ message: "Por favor, preencha todos os campos." });
    }// Se serviceId ou dateTime não forem fornecidos, retorna um erro 400 com a mensagem "Por favor, preencha todos os campos."

    // REGRA DE NEGÓCIO: Verifica se o horário já está ocupado
    const appointmentExists = appointmentsDatabase.find(
      app => app.dateTime === dateTime
    );// Procura no banco de dados de agendamentos se já existe um agendamento com o mesmo dateTime. Se existir, retorna true, caso contrário, retorna false.

    if (appointmentExists) {
      return res.status(400).json({ message: "Desculpe, este horário já está preenchido." });
    }// Se já existir um agendamento com o mesmo dateTime, retorna um erro 400 com a mensagem "Desculpe, este horário já está preenchido."

    // Salva o agendamento se o horário estiver livre
    const newAppointment = {
      id: Date.now().toString(),// Gera um ID único baseado no tempo
      userId,// Pega do token JWT via middleware de segurança
      serviceId,// Recebe do body: serviceId
      dateTime,// Recebe do body: dateTime
      status: "confirmado"// Define o status do agendamento como "confirmado"
    };// Cria um novo objeto de agendamento com um ID único baseado no tempo, o userId do usuário logado, o serviceId e dateTime fornecidos, e define o status como "confirmado".

    appointmentsDatabase.push(newAppointment);// Adiciona o novo agendamento ao banco de dados de agendamentos
    res.status(201).json({ message: "Agendamento realizado com sucesso!", appointment: newAppointment });// Adiciona o novo agendamento ao banco de dados de agendamentos e retorna uma resposta 201 (Criado) com uma mensagem de sucesso e os detalhes do agendamento criado.
  } catch (error) {
    res.status(500).json({ message: "Erro ao agendar.", error: error.message });// Em caso de erro, retorna um erro 500 com a mensagem "Erro ao agendar" e o detalhe do erro.
  }
};

// Listar agendamentos do usuário logado
exports.getMyAppointments = (req, res) => {
  const userId = req.user.id;// Pego do token JWT via middleware de segurança
  const myApps = appointmentsDatabase.filter(app => app.userId === userId);// Filtra o banco de dados de agendamentos para retornar apenas os agendamentos que pertencem ao usuário logado, com base no userId extraído do token JWT.
  res.json(myApps);// Retorna a lista de agendamentos do usuário logado em formato JSON
};// Retorna a lista de agendamentos do usuário logado em formato JSON
