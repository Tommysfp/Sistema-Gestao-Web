import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const removerAcentos = (texto) => {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

function Clientes() {
  const [hoverExcluirCliente, setHoverExcluirCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const carregarClientes = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await api.get('/clientes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClientes(res.data);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setMensagem('❌ Erro ao carregar clientes');
      }
    };

    carregarClientes();
  }, []);

  const excluirCliente = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este cliente?');
    if (!confirmar) return;

    const token = localStorage.getItem('token');
    try {
      await api.delete(`/clientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem('✅ Cliente excluído com sucesso!');
      setClientes(clientes.filter(cliente => cliente.id !== id));
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setMensagem('❌ Este cliente possui vendas e não pode ser excluído');
    }
  };

  return (
    <div className="container">
      <h2 className="titulo">Lista de Clientes</h2>

      <input
        type="text"
        placeholder="Buscar por nome..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        className="input-busca"
      />

      {mensagem && (
        <p className={`mensagem ${mensagem.includes('✅') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </p>
      )}

      <table className="tabela-clientes">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Contato</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes
            .filter(cliente =>
              removerAcentos(cliente.nome.toLowerCase()).includes(
                removerAcentos(busca.toLowerCase())
              )
            )
            .map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.contato}</td>
                <td>{cliente.endereco}</td>
                <td>
                  <button
                    onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                    className="botao botao-editar"
                  >
                    Editar
                  </button>
                  <button
                className={`botao botao-excluir ${hoverExcluirCliente === cliente.id ? 'hover-x' : ''}`}
                onClick={() => excluirCliente(cliente.id)}
                onMouseEnter={() => setHoverExcluirCliente(cliente.id)}
                onMouseLeave={() => setHoverExcluirCliente(null)}
              >
                {hoverExcluirCliente === cliente.id ? '✖' : 'Excluir'}
              </button>

                </td>
              </tr>
            ))}
        </tbody>
    


      </table>
      <br />
      <button
  className="botao botao-adicionar"
  onClick={() => navigate('/clientes/cadastrar')}
>
  ➕ Adicionar Cliente
</button>
    </div>
  );
}

export default Clientes;
