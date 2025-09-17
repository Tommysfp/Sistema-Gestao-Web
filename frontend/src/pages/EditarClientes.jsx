import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function EditarCliente() {
  const { id } = useParams();
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [endereco, setEndereco] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarCliente = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await api.get(`/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.nome) {
          setNome(res.data.nome);
          setContato(res.data.contato);
          setEndereco(res.data.endereco);
          setErroCarregamento(false);
        } else {
          setErroCarregamento(true);
        }
      } catch (err) {
        setErroCarregamento(true);
        console.error('Erro ao buscar cliente:', err);
      } finally {
        setCarregando(false);
      }
    };

    carregarCliente();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.put(`/clientes/${id}`, { nome, contato, endereco }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/clientes');
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      alert('❌ Erro ao atualizar cliente');
    }
  };

  return (
    <div className="editar-cliente-container">
      <h2>Editar Cliente</h2>

      {carregando ? (
        <p>Carregando dados...</p>
      ) : erroCarregamento ? (
        <p className="erro">❌ Erro ao carregar cliente</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Contato"
            value={contato}
            onChange={e => setContato(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            required
          />
          <button type="submit">Salvar</button>
        </form>
      )}
    </div>
  );
}

export default EditarCliente;
