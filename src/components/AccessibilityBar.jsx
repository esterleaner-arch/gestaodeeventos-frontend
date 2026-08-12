import { useState, useEffect } from 'react';
import { Moon, Sun, Minus, Plus, Type } from 'lucide-react';
import styles from './AccessibilityBar.module.css';

// Escala de tamanho de letra em % do tamanho raiz (html)
const TAMANHOS = [90, 100, 110, 120, 130];

export default function AccessibilityBar() {
  // Tema claro/escuro persistido
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('@GerenciadorEventos:tema') === 'dark';
  });

  // Índice do tamanho de fonte persistido
  const [indiceFonte, setIndiceFonte] = useState(() => {
    const salvo = parseInt(localStorage.getItem('@GerenciadorEventos:fonte') || '100', 10);
    const idx = TAMANHOS.indexOf(salvo);
    return idx === -1 ? 1 : idx;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('@GerenciadorEventos:tema', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    // Como o app usa rem, basta escalar a fonte raiz para redimensionar tudo
    document.documentElement.style.fontSize = `${TAMANHOS[indiceFonte]}%`;
    localStorage.setItem('@GerenciadorEventos:fonte', String(TAMANHOS[indiceFonte]));
  }, [indiceFonte]);

  const aumentar = () => setIndiceFonte((i) => Math.min(i + 1, TAMANHOS.length - 1));
  const diminuir = () => setIndiceFonte((i) => Math.max(i - 1, 0));

  return (
    <nav className={styles.bar} aria-label="Ferramentas de acessibilidade">
      <div className={styles.group}>
        <button
          type="button"
          className={styles.button}
          onClick={diminuir}
          aria-label="Diminuir tamanho da letra"
          title="Diminuir letra"
          disabled={indiceFonte === 0}
        >
          <Minus size={18} aria-hidden="true" />
          <Type size={18} aria-hidden="true" />
        </button>
        <span className={styles.fontLevel} aria-live="polite">
          {TAMANHOS[indiceFonte]}%
        </span>
        <button
          type="button"
          className={styles.button}
          onClick={aumentar}
          aria-label="Aumentar tamanho da letra"
          title="Aumentar letra"
          disabled={indiceFonte === TAMANHOS.length - 1}
        >
          <Plus size={18} aria-hidden="true" />
          <Type size={18} aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={() => setDark((d) => !d)}
        aria-pressed={dark}
        aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        title={dark ? 'Modo claro' : 'Modo escuro'}
      >
        {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        <span>{dark ? 'Claro' : 'Escuro'}</span>
      </button>
    </nav>
  );
}
