import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { loginService } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [gravarSenha, setGravarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Recupera credenciais automáticas caso tenha optado por Gravar Senha
  useEffect(() => {
    const emailSalvo = localStorage.getItem('@GerenciadorEventos:lembrarEmail');
    const senhaSalva = localStorage.getItem('@GerenciadorEventos:lembrarSenha');
    if (emailSalvo && senhaSalva) {
      setEmail(emailSalvo);
      setSenha(senhaSalva);
      setGravarSenha(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Dispara o login real mapeado no Contexto e integrado via Axios
      await loginService(email, senha, gravarSenha);
      navigate('/home');
    } catch (err) {
      setErro(err.message || 'Usuário ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.card} aria-labelledby="login-title">
        <h1 id="login-title" className={styles.title}>Login do Administrador</h1>
        
        <form onSubmit={handleLogin} className={styles.form} noValidate>
          {erro && (
            <div className={styles.alertError} role="alert" aria-live="assertive">
              {erro}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              disabled={carregando}
              required
              aria-required="true"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="senha" className={styles.label}>Senha</label>
            <input
              type="password"
              id="senha"
              className={styles.input}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha segura"
              disabled={carregando}
              required
              aria-required="true"
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="gravarSenha"
              className={styles.checkbox}
              checked={gravarSenha}
              onChange={(e) => setGravarSenha(e.target.checked)}
              disabled={carregando}
            />
            <label htmlFor="gravarSenha" className={styles.checkboxLabel}>
              Gravar Senha para acesso rápido
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.buttonPrimary} disabled={carregando}>
              {carregando ? 'Autenticando...' : 'Entrar'}
            </button>
            <Link to="/cadastro" className={styles.buttonSecondary} role="button">
              Cadastrar-se
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
