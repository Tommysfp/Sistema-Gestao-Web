import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './VendaHistorico.css';

function VendaHistorico() {
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/vendas', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setVendas(res.data))
      .catch(err => console.error('Erro ao buscar vendas:', err));
  }, []);

  return (
    <div className="historico-container">
      <h2>📄 Histórico de Vendas</h2>

      {vendas.length === 0 ? (
        <p>Nenhuma venda registrada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map(venda => (
              <tr key={venda.id}>
                <td>{venda.id}</td>
                <td>{new Date(venda.data_venda).toLocaleString('pt-BR')}</td>
                <td>{venda.cliente || 'Avulso'}</td>
                <td>R$ {Number(venda.valor_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VendaHistorico;
