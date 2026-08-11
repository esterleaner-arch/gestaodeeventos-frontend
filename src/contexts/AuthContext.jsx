import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

// Decodifica o payload do JWT para extrair dados como o adminId
function decodificarToken(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Restaura a sessão do administrador de forma síncrona na inicialização
  const [user, setUser] = useState(() => {
    const tokenSalvo = localStorage.getItem('@GerenciadorEventos:token');
    const adminIdSalvo = localStorage.getItem('@GerenciadorEventos:adminId');

    if (tokenSalvo && adminIdSalvo) {
      return { id: adminIdSalvo };
    }

    return null;
  });

  const loginService = async (email, senha, lembrar) => {
    try {
      // Dispara a requisição HTTP POST para o endpoint de autenticação
      const response = await api.post('/auth/login', { email, senha });

      const token = response.data.token || response.data.tokenJwt;

      // O backend retorna apenas o token; o adminId é extraído do JWT
      const dadosToken = decodificarToken(token);
      const id =
        response.data.id ||
        response.data.adminId ||
        response.data.admin?.id ||
        dadosToken?.adminId;

      // Validação de segurança: interrompe o fluxo se faltarem dados essenciais
      if (!token || !id) {
        throw new Error(
          'O servidor respondeu com sucesso, mas omitiu as chaves de identificação essenciais.',
          { cause: response }
        );
      }

      // Salva os dados de sessão obrigatórios no LocalStorage
      localStorage.setItem('@GerenciadorEventos:token', token);
      localStorage.setItem('@GerenciadorEventos:adminId', String(id));

      // Regra de negócio: gerencia a retenção de dados conforme "Gravar Senha"
      if (lembrar) {
        localStorage.setItem('@GerenciadorEventos:lembrarEmail', email);
        localStorage.setItem('@GerenciadorEventos:lembrarSenha', senha);
      } else {
        localStorage.removeItem('@GerenciadorEventos:lembrarEmail');
        localStorage.removeItem('@GerenciadorEventos:lembrarSenha');
      }

      // Atualiza o estado global informando o ID ao React
      setUser({ id: String(id) });
      return { token, id };
    } catch (error) {
      // Trata erros de rede ou respostas negativas da API (Ex: 401/403)
      const mensagemErro = error.response?.data?.message || 'E-mail ou senha incorretos.';
      throw new Error(mensagemErro, { cause: error });
    }
  };

  const logoutService = () => {
    // Limpa os dados de sessão do navegador ao deslogar
    localStorage.removeItem('@GerenciadorEventos:token');
    localStorage.removeItem('@GerenciadorEventos:adminId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loginService, logoutService }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
