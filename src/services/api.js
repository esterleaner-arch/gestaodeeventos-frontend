import axios from 'axios';

const api = axios.create({
  // URL base do seu servidor Spring Boot local
  baseURL: 'http://localhost:8080/api',
});

// Interceptor: Injeta o Token JWT de forma automatizada antes de cada requisição
api.interceptors.request.use(
  (config) => {
    // Tenta buscar o token que o login salvou no navegador
    const token = localStorage.getItem('@GerenciadorEventos:token');
    
    if (token) {
      // Injeta o cabeçalho idêntico ao exigido pelo seu SecurityConfig do Spring Boot
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
