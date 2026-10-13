const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Pega o token enviado no cabeçalho (Header) da requisição
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    // Valida o token usando a chave secreta
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'chave_reserva');
    req.user = verified; // Adiciona os dados do usuário na requisição
    next(); // Permite que a requisição continue para o controlador
  } catch (error) {
    res.status(403).json({ message: "Token inválido ou expirado." });
  }
};
