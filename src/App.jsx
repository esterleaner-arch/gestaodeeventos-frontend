import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import Home from './pages/home';
import AccessibilityBar from './components/AccessibilityBar';


export default function App() {
  return (
    <BrowserRouter>
      {/* ♿ Ferramentas de acessibilidade globais (dark, tamanho de letra) */}
      <AccessibilityBar />
      <Routes>
        {/* Rota inicial: Redireciona o usuário direto para a Tela de Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Mapeamento das telas criadas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        
        {/* Rota de fallback: Qualquer caminho inválido manda de volta para o Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>

    
  );
}
