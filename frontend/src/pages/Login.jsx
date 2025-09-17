import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [modoCadastro, setModoCadastro] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      if (modoCadastro) {
        await api.post('/usuarios/cadastrar', { nome, email, senha });
        setModoCadastro(false);
        setErro('✅ Cadastro realizado com sucesso! Faça login.');
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        const response = await api.post('/usuarios/login', { email, senha });
        localStorage.setItem('token', response.data.token);
        navigate('/clientes');
      }
    } catch (err) {
      setErro(modoCadastro ? '❌ Erro ao cadastrar usuário' : '❌ Email ou senha inválidos');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>{modoCadastro ? 'Cadastro de Usuário' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {modoCadastro && (
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={e => {
              setNome(e.target.value);
              setErro('');
            }}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setErro('');
          }}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => {
            setSenha(e.target.value);
            setErro('');
          }}
          required
        />
        <button type="submit">
          {modoCadastro ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      <button className="toggle-btn" onClick={() => {
        setModoCadastro(!modoCadastro);
        setErro('');
      }}>
        {modoCadastro ? 'Já tenho conta' : 'Criar nova conta'}
      </button>

      {erro && (
        <p className="mensagem-feedback">
          {erro}
        </p>
      )}
    </div>
  );
}

export default Login;
