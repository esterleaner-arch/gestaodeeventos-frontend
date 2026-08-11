import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';


export default function App() {
  return (
    <BrowserRouter>
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
