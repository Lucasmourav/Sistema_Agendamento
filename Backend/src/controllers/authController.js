const bcrypt = require('bcryptjs');// Importa o módulo bcryptjs para criptografar senhas.
const jwt = require('jsonwebtoken');// Importa o módulo jsonwebtoken para gerar tokens JWT.

// Banco de dados em memória (Um array simples)
const usersDatabase = [];

// Registro de Usuário
exports.register = async (req, res) => {
  try {

    const { name, email, password, role } = req.body; //Recebe do body: name, email, password e role.
    const userExists = usersDatabase.find(u => u.email === email); //Verifica se o e-mail já existe.
    if (userExists) return res.status(400).json({ message: 'Este e-mail já está cadastrado.' }); //Se existir, retorna erro 400.

    const salt = await bcrypt.genSalt(10); // Criptografa a senha manualmente
    const hashedPassword = await bcrypt.hash(password, salt); //Criptografa a senha com bcrypt.

    const newUser = { // Cria um novo usuário
      id: Date.now().toString(), // Gera um ID único baseado no tempo
      name, // Recebe o nome do usuário
      email, // Recebe o e-mail do usuário
      password: hashedPassword, // Armazena a senha criptografada
      role: role || 'client' // Define o papel do usuário, padrão é 'client'
    };// Cria um novo objeto de usuário com as informações fornecidas e a senha criptografada.
    
    usersDatabase.push(newUser); //Salva no array usersDatabase.

    res.status(201).json({ message: 'Usuário criado com sucesso!' }); //Retorna com sucesso 201.
  } catch (error) { 
    res.status(500).json({ message: 'Erro no servidor.', error: error.message }); //caso de erro retorno um erro 500.
  }
};

// Login de Usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // recebe email e senha do body
    
    const user = usersDatabase.find(u => u.email === email); // Procura o usuário no array do usersDatabase
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas.' }); // Se não encontrar, retorna erro 400 com a messagem credenciais inválidas.

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    // Compara a senha fornecida com a senha armazenada no banco de dados usando bcrypt. Se não houver correspondência, retorna um erro 400 com a mensagem "Credenciais inválidas".
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas.' });

    // Gera o Token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'chave_reserva',
      { expiresIn: '1d' }
    );// Gera um token JWT com o id e role do usuário, usando uma chave secreta e definindo a expiração para 1 dia.

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });// Retorna o token e as informações do usuário (id, nome e papel) em formato JSON.
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.', error: error.message });// Em caso de erro, retorna um erro 500 com a mensagem "Erro no servidor" e o detalhe do erro.
  }
};

// Exportamos o banco em memória para que a Semana 2 possa usá-lo também
exports.usersDatabase = usersDatabase;
