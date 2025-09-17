import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo"> MyDashboard</div>

      <ul className="navbar-links">
        <li><Link to="/clientes"> Clientes</Link></li>
        <li><Link to="/produtos"> Produtos</Link></li>
        <li><Link to="/venda"> Vendas</Link></li>
        <li><Link to="/relatorios"> Relatórios</Link></li>
      </ul>

      <div className="navbar-user">
        <span className="navbar-username"> Tommysfpcs</span>
        <button className="logout-btn">Sair</button>
      </div>
    </nav>
  );
}

export default Navbar;
