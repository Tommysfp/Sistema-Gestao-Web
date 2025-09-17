import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './CadastrarClientes.css';

function CadastrarCliente() {
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [endereco, setEndereco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    const token = localStorage.getItem('token');

    try {
      await api.post('/clientes', { nome, contato, endereco }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMensagem('✅ Cliente cadastrado com sucesso!');
      setNome('');
      setContato('');
      setEndereco('');
      setTimeout(() => navigate('/clientes'), 1500);
    } catch (err) {
      setMensagem('❌ Erro ao cadastrar cliente');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        /><br /><br />
        <input
          type="text"
          placeholder="Contato"
          value={contato}
          onChange={e => setContato(e.target.value)}
          required
        /><br /><br />
        <input
          type="text"
          placeholder="Endereço"
          value={endereco}
          onChange={e => setEndereco(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && (
        <p style={{ marginTop: '1rem', color: mensagem.includes('✅') ? 'green' : 'red' }}>
          {mensagem}
        </p>
      )}
    </div>
  );
}

export default CadastrarCliente;
