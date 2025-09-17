import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    categoria: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarProduto = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await api.get('/produtos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const produto = res.data.find(p => p.id === parseInt(id));
        if (produto) {
          setForm({
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            quantidade: produto.quantidade,
            categoria: produto.categoria
          });
        } else {
          setMensagem('❌ Produto não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
        setMensagem('❌ Erro ao carregar produto');
      } finally {
        setCarregando(false);
      }
    };

    carregarProduto();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.put(`/produtos/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem('✅ Produto atualizado com sucesso!');
      setTimeout(() => navigate('/produtos'), 1500);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      setMensagem('❌ Erro ao atualizar produto');
    }
  };

  if (carregando) return <p className="carregando">Carregando produto...</p>;

  return (
    <div className="container-editar">
      <h2 className="titulo">Editar Produto</h2>

      {mensagem && (
        <p className={`mensagem ${mensagem.includes('✅') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </p>
      )}

      <form onSubmit={handleSubmit} className="form-editar">
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
          type="text"
          placeholder="Categoria"
          value={form.categoria}
          onChange={e => setForm({ ...form, categoria: e.target.value })}
          className="input-form"
        />

        <input type="hidden" value={form.quantidade} readOnly />

        <button type="submit" className="botao botao-editar">Salvar</button>
      </form>
    </div>
  );
}

export default EditarProduto;
