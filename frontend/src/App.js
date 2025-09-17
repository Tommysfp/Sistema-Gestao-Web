import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Produtos from './pages/Produtos';
import Clientes from './pages/Clientes';
import Vendas from './pages/Venda';
import CadastrarCliente from './pages/CadastrarClientes';
import EditarCliente from './pages/EditarClientes';
import EditarProduto from './pages/EditarProduto';
import Navbar from './components/Navbar';
import VendaHistorico from './pages/VendaHistorico';


function AppRoutes() {
  const location = useLocation();
  const hideNavbarOn = ['/']; // páginas onde a navbar não aparece (ex: login)

  const mostrarNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {mostrarNavbar && <Navbar />}
      <Routes>
        <Route path="/vendas/historico" element={<VendaHistorico />} />
        <Route path="/" element={<Login />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/:id/editar" element={<EditarProduto />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/cadastrar" element={<CadastrarCliente />} />
        <Route path="/clientes/editar/:id" element={<EditarCliente />} />
        <Route path="/venda" element={<Vendas />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
