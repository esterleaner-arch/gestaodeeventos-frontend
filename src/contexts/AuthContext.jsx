import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaura a sessão do administrador se houver dados gravados no navegador
    const tokenSalvo = localStorage.getItem('@GerenciadorEventos:token');
    const adminIdSalvo = localStorage.getItem('@GerenciadorEventos:adminId');

    if (tokenSalvo && adminIdSalvo) {
      setUser({ id: adminIdSalvo });
    }
    setLoading(false);
  }, []);

  const loginService = async (email, senha, lembrar) => {
    try {
      // Dispara a requisição HTTP POST para o endpoint correto de autenticação
      const response = await api.post('/auth/login', { email, senha });
      
      // 🔴 TRATAMENTO INTELIGENTE DO DTO: Captura as chaves independentemente da grafia do Java
      const token = response.data.token || response.data.tokenJwt;
      const id = response.data.id || response.data.adminId || response.data.admin?.id;

      // Validação de segurança: Interrompe o fluxo se a resposta do banco vier incompleta
      if (!token || !id) {
        throw new Error("O servidor respondeu com sucesso, mas omitiu chaves de identificação essenciais.");
      }

      // Salva os dados de sessão obrigatórios de forma persistente no LocalStorage
      localStorage.setItem('@GerenciadorEventos:token', token);
      localStorage.setItem('@GerenciadorEventos:adminId', String(id));

      // Regra de Negócio Exigida: Gerencia a retenção de dados com base na opção "Gravar Senha"
      if (lembrar) {
        localStorage.setItem('@GerenciadorEventos:lembrarEmail', email);
        localStorage.setItem('@GerenciadorEventos:lembrarSenha', senha);
      } else {
        localStorage.removeItem('@GerenciadorEventos:lembrarEmail');
        localStorage.removeItem('@GerenciadorEventos:lembrarSenha');
      }

      // Atualiza o estado global de autenticação informando o ID ao React
      setUser({ id: String(id) });
      return { token, id };

    } catch (error) {
      // Trata erros de rede ou respostas negativas da API (Ex: 401/403 do Spring Boot)
      const mensagemErro = error.response?.data?.message || 'E-mail ou senha incorretos.';
      throw new Error(mensagemErro);
    }
  };

  const logoutService = () => {
    // Limpa os dados de sessão do navegador ao deslogar
    localStorage.removeItem('@GerenciadorEventos:token');
    localStorage.removeItem('@GerenciadorEventos:adminId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loginService, logoutService, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
