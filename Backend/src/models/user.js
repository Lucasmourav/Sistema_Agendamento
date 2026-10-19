const mongoose = require('mongoose');// Importa o módulo mongoose para interagir com o MongoDB
const bcrypt = require('bcryptjs'); // Importa o módulo bcryptjs para criptografar senhas

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },// Define o campo name como uma string obrigatória
  email: { type: String, required: true, unique: true },// Define o campo email como uma string obrigatória e única
  password: { type: String, required: true },// Define o campo password como uma string obrigatória
  role: { type: String, enum: ['client', 'admin'], default: 'client' }// Define o campo role como uma string que só pode ser 'client' ou 'admin', com 'client' como valor padrão
});/* Define o esquema do usuário com os campos name, email, 
password e role. O campo role é limitado a 'client' ou 'admin', com 'client' como padrão.*/

// Criptografa a senha antes de salvar no banco
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();// Se a senha não foi modificada, passa para o próximo middleware
  const salt = await bcrypt.genSalt(10);// Gera um salt para a criptografia da senha
  this.password = await bcrypt.hash(this.password, salt);// Criptografa a senha usando bcrypt e o salt gerado
  next();// Chama o próximo middleware na cadeia
});//Define um middleware que é executado antes de salvar um usuário no banco.

module.exports = mongoose.model('User', UserSchema);// Exporta o modelo User baseado no esquema definido, permitindo que seja usado em outras partes da aplicação.