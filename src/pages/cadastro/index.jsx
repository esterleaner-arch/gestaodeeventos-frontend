import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PasswordInput from '../../components/PasswordInput';
import styles from './Cadastro.module.css';

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    // Validação local obrigatória
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem. Verifique os campos e tente novamente.');
      return;
    }

    setCarregando(true);

    try {
      // Dispara a chamada real para a rota mapeada no seu AuthController do Spring Boot
      await api.post('/auth/register', {
        nome,
        email,
        senha
      });

      setSucesso(true);
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');

      // Aguarda o feedback visual de sucesso na tela antes do redirecionamento
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      const mensagemErro = err.response?.data?.message || 'Este e-mail já está cadastrado ou servidor inacessível.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.card} aria-labelledby="cadastro-title">
        <p className={styles.brand}>Gerenciador de Eventos</p>
        <h1 id="cadastro-title" className={styles.title}>Cadastro do Administrador</h1>
        
        <form onSubmit={handleCadastro} className={styles.form} noValidate>
          {erro && (
            <div className={styles.alertError} role="alert" aria-live="assertive">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className={styles.alertSuccess} role="alert" aria-live="polite">
              Administrador cadastrado com sucesso! Redirecionando...
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
              disabled={carregando}
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
              disabled={carregando}
              required
              aria-required="true"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="senha" className={styles.label}>Senha</label>
            <PasswordInput
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={carregando}
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmarSenha" className={styles.label}>Confirmar Senha</label>
            <PasswordInput
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a senha digitada"
              disabled={carregando}
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.buttonPrimary} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Cadastro'}
            </button>
            <Link to="/login" className={styles.buttonSecondary} role="button">
              Voltar para o Login
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
