import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configuração da URL base da sua API do Back-end
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

function App() {
  // Estados para controle de telas e autenticação
  const [screen, setScreen] = useState('login'); // login, register, dashboard
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Estados dos formulários
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [message, setMessage] = useState('');

  // Carrega os serviços disponíveis assim que o usuário loga
  useEffect(() => {
    if (token) {
      API.get('/appointments/services')
        .then(res => setServices(res.data))
        .catch(err => console.error("Erro ao carregar serviços", err));
      setScreen('dashboard');
    }
  }, [token]);

  // Função de Cadastro
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      alert(res.data.message);
      setScreen('login');
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao cadastrar');
    }
  };

  // Função de Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email: formData.email, password: formData.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || 'Credenciais inválidas');
    }
  };

  // Função de Logout
  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUser(null);
    setScreen('login');
  };

  // Função de Agendamento
  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/appointments/book', 
        { serviceId: selectedService, dateTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Erro ao agendar'}`);
    }
  };

  return (
    <div className="container">
      {screen === 'login' && (
        <form onSubmit={handleLogin} className="card">
          <h2>🔑 Login</h2>
          <input type="email" placeholder="E-mail" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Senha" required onChange={e => setFormData({...formData, password: e.target.value})} />
          <button type="submit">Entrar</button>
          <p onClick={() => setScreen('register')}>Não tem conta? Cadastre-se</p>
        </form>
      )}

      {screen === 'register' && (
        <form onSubmit={handleRegister} className="card">
          <h2>📝 Cadastro</h2>
          <input type="text" placeholder="Nome Completo" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="E-mail" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Senha" required onChange={e => setFormData({...formData, password: e.target.value})} />
          <button type="submit">Criar Conta</button>
          <p onClick={() => setScreen('login')}>Já tem conta? Entre aqui</p>
        </form>
      )}

      {screen === 'dashboard' && (
        <div className="card">
          <h2>Olá, {user?.name}! 👋</h2>
          <button onClick={handleLogout} className="btn-logout">Sair da Conta</button>
          
          <form onSubmit={handleBooking} className="booking-form">
            <h3>📅 Novo Agendamento</h3>
            
            <label>Selecione o Serviço:</label>
            <select required onChange={e => setSelectedService(e.target.value)} value={selectedService}>
              <option value="">-- Escolha um serviço --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - R\$ {s.price}</option>
              ))}
            </select>

            <label>Escolha a Data e Horário:</label>
            <input type="datetime-local" required onChange={e => setDateTime(e.target.value.replace('T', ' '))} />

            <button type="submit">Confirmar Horário</button>
          </form>

          {message && <p className="status-message">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
