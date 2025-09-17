import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Venda.css';
import { Link } from 'react-router-dom';


function Venda() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState([{ produto_id: '', quantidade: 1, preco_unitario: 0 }]);
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/clientes', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setClientes(res.data));
    api.get('/produtos', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        // Garante que preco seja número
        const produtosFormatados = res.data.map(p => ({
          ...p,
          preco: Number(p.preco)
        }));
        setProdutos(produtosFormatados);
      });
  }, []);

  useEffect(() => {
    const total = itens.reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0);
    setValorTotal(total);
  }, [itens]);

  const handleItemChange = (index, field, value) => {
    const novosItens = [...itens];

    if (field === 'produto_id') {
      const produtoSelecionado = produtos.find(p => p.id === Number(value));
      novosItens[index].produto_id = value;
      novosItens[index].preco_unitario = produtoSelecionado ? produtoSelecionado.preco : 0;
    } else if (field === 'quantidade') {
      novosItens[index].quantidade = Number(value);
    }

    setItens(novosItens);
  };

  const adicionarItem = () => {
    setItens([...itens, { produto_id: '', quantidade: 1, preco_unitario: 0 }]);
  };

  const removerItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const finalizarVenda = async () => {
    const token = localStorage.getItem('token');
    try {
      const payload = {
        cliente_id: clienteId || null,
        itens
      };
      const res = await api.post('/vendas', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`✅ Venda registrada! ID: ${res.data.venda_id}`);
      setClienteId('');
      setItens([{ produto_id: '', quantidade: 1, preco_unitario: 0 }]);
    } catch (err) {
      console.error(err);
      alert('❌ Erro ao registrar venda');
    }
  };

  return (
    <div className="venda-container">
      <h2>🛒 Registrar Venda</h2>

      <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
        <option value="">Cliente (opcional)</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>

      {itens.map((item, index) => (
        <div key={index} className="item-venda">
          <select
            value={item.produto_id}
            onChange={e => handleItemChange(index, 'produto_id', e.target.value)}
          >
            <option value="">Produto</option>
            {produtos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} — R$ {Number(p.preco).toFixed(2)}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Qtd"
            value={item.quantidade}
            onChange={e => handleItemChange(index, 'quantidade', e.target.value)}
            min={1}
          />

          <span className="preco-unitario">R$ {item.preco_unitario.toFixed(2)}</span>

          <button onClick={() => removerItem(index)}>🗑️</button>
        </div>
      ))}

      <button className="adicionar-btn" onClick={adicionarItem}>➕ Adicionar Produto</button>


      <h3>Total: R$ {valorTotal.toFixed(2)}</h3>

      <button className="finalizar-btn" onClick={finalizarVenda}>💾 Finalizar Venda</button>
      <Link to="/vendas/historico" className="historico-btn">📄 Ver Histórico de Vendas</Link>




       
    </div>
  );
}

export default Venda;
