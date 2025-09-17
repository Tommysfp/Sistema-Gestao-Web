import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import EditarProduto from './pages/EditarProduto';
import VendaHistorico from './pages/VendaHistorico';
import './App.css'; 
import Venda from './pages/Venda';




function App() {
  return (
    <Router>
      <Navbar />
      <Routes> 
        <Route path="/vendas/historico" element={<VendaHistorico />} />
        <Route path="/" element={<Clientes />} />
        <Route path="/vendas" element={<Venda />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/:id/editar" element={<EditarProduto />} />
      </Routes>
    </Router>
  );
}

export default App;
