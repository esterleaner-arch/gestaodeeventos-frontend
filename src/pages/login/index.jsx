import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [gravarSenha, setGravarSenha] = useState(false);

  // Carrega as credenciais salvas se o usuário optou por "Gravar Senha" anteriormente
  useEffect(() => {
    const emailSalvo = localStorage.getItem('@GerenciadorEventos:email');
    const senhaSalva = localStorage.getItem('@GerenciadorEventos:senha');
    if (emailSalvo && senhaSalva) {
      setEmail(emailSalvo);
      setSenha(senhaSalva);
      setGravarSenha(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Regra de Negócio: Gravar Senha localmente para acesso rápido nas próximas vezes
    if (gravarSenha) {
      localStorage.setItem('@GerenciadorEventos:email', email);
      localStorage.setItem('@GerenciadorEventos:senha', senha);
    } else {
      localStorage.removeItem('@GerenciadorEventos:email');
      localStorage.removeItem('@GerenciadorEventos:senha');
    }

    console.log('Disparando login para a API...', { email, senha });
  };

  return (
    <main className={styles.container}>
      {/* aria-labelledby associa o título ao card para leitores de tela */}
      <section className={styles.card} aria-labelledby="login-title">
        <h1 id="login-title" className={styles.title}>Login do Administrador</h1>
        
        <form onSubmit={handleLogin} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            {/* O htmlFor conecta explicitamente o label ao input para acessibilidade */}
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
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
            />
            <label htmlFor="gravarSenha" className={styles.checkboxLabel}>
              Gravar Senha para acesso rápido
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.buttonPrimary}>
              Entrar
            </button>
            <button type="button" className={styles.buttonSecondary}>
              Cadastrar-se
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
