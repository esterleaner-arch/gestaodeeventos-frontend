import React, { useState } from 'react';
import styles from './Cadastro.module.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleCadastro = (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    // Validação obrigatória: Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem. Verifique os campos e tente novamente.');
      return;
    }

    console.log('Disparando cadastro para a API...', { nome, email, senha });
    
    // Simulação de sucesso da API (posteriormente integrado ao Axios)
    setSucesso(true);
    
    // Limpa os campos do formulário após o sucesso
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
  };

  return (
    <main className={styles.container}>
      <section className={styles.card} aria-labelledby="cadastro-title">
        <h1 id="cadastro-title" className={styles.title}>Cadastro do Administrador</h1>
        
        <form onSubmit={handleCadastro} className={styles.form} noValidate>
          {/* Mensagem de Feedback de Erro Acessível */}
          {erro && (
            <div className={styles.alertError} role="alert" aria-live="assertive">
              {erro}
            </div>
          )}

          {/* Mensagem de Feedback de Sucesso Exigida no Requisito */}
          {sucesso && (
            <div className={styles.alertSuccess} role="alert" aria-live="polite">
              Administrador cadastrado com sucesso!
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="nome" className={styles.label}>Nome do Administrador</label>
            <input
              type="text"
              id="nome"
              className={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome completo"
              required
              aria-required="true"
            />
          </div>

          <div className={styles.inputGroup}>
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
              placeholder="Mínimo 6 caracteres"
              required
              aria-required="true"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmarSenha" className={styles.label}>Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              className={styles.input}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a senha digitada"
              required
              aria-required="true"
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.buttonPrimary}>
              Salvar Cadastro
            </button>
            <button type="button" className={styles.buttonSecondary}>
              Voltar para o Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
