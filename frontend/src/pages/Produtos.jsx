import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


const removerAcentos = (texto) => {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    categoria: ''
  });
  const [reposicoes, setReposicoes] = useState({});
  const [hoverExcluir, setHoverExcluir] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get('/produtos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProdutos(res.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setMensagem('❌ Erro ao carregar produtos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/produtos', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem('✅ Produto cadastrado com sucesso!');
      setForm({ nome: '', descricao: '', preco: '', quantidade: '', categoria: '' });
      carregarProdutos();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setMensagem('❌ Erro ao salvar produto');
    }
  };

  const excluirProduto = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este produto?');
    if (!confirmar) return;

    const token = localStorage.getItem('token');
    try {
      await api.delete(`/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem('✅ Produto excluído com sucesso!');
      carregarProdutos();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      setMensagem('❌ Erro ao excluir produto');
    }
  };

  const reporEstoque = async (id) => {
    const token = localStorage.getItem('token');
    const quantidade = parseInt(reposicoes[id]);
    if (!quantidade || quantidade <= 0) return;

    try {
      await api.put(`/produtos/${id}/repor`, { quantidade_repor: quantidade }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem(`✅ Estoque do produto ${id} atualizado com +${quantidade}`);
      setReposicoes({ ...reposicoes, [id]: '' });
      carregarProdutos();
    } catch (err) {
      console.error('Erro ao repor estoque:', err);
      setMensagem('❌ Erro ao repor estoque');
    }
  };

  return (
    <div className="container">
      <h2 className="titulo">Cadastro de Produtos</h2>

      <form onSubmit={handleSubmit} className="form-produto">
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          required
          className="input-form"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
          className="input-form"
        />
        <input
          type="number"
          placeholder="Preço"
          value={form.preco}
          onChange={e => setForm({ ...form, preco: e.target.value })}
          required
          className="input-form"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={e => setForm({ ...form, quantidade: e.target.value })}
          required
          className="input-form"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={form.categoria}
          onChange={e => setForm({ ...form, categoria: e.target.value })}
          className="input-form"
        />
        <button type="submit" className="botao botao-editar">Cadastrar</button>
      </form>

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
            <th>Descrição</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos
            .filter(p =>
              removerAcentos(p.nome.toLowerCase()).includes(
                removerAcentos(busca.toLowerCase())
              )
            )
            .map(produto => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                <td>{produto.quantidade}</td>
                <td>{produto.categoria}</td>
                <td>
                  <button
                    onClick={() => navigate(`/produtos/${produto.id}/editar`)}
                    className="botao botao-editar"
                  >
                    Editar
                  </button>
                  <button
                    className={`botao botao-excluir ${hoverExcluir === produto.id ? 'hover-x' : ''}`}
                    onClick={() => excluirProduto(produto.id)}
                    onMouseEnter={() => setHoverExcluir(produto.id)}
                    onMouseLeave={() => setHoverExcluir(null)}
                    >
                    {hoverExcluir === produto.id ? '✖' : 'Excluir'}
                    </button>


                  <input
                    type="number"
                    placeholder="Qtd"
                    value={reposicoes[produto.id] || ''}
                    onChange={e =>
                      setReposicoes({ ...reposicoes, [produto.id]: e.target.value })
                    }
                    className="input-repor"
                  />
                  <button
                    onClick={() => reporEstoque(produto.id)}
                    className="botao botao-editar"
                  >
                    Repor
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Produtos;
