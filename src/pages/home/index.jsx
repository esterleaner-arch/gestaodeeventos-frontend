import React, { useState } from 'react';
import styles from './Home.module.css';

export default function Home() {
  const [eventos, setEventos] = useState([
    {
      id: 1,
      nome: 'Workshop de Spring Boot',
      data: '2026-09-20',
      localizacao: 'Auditório Principal',
      imagemUrl: 'https://unsplash.com'
    },
    {
      id: 2,
      nome: 'Festival de Inverno',
      data: '2026-07-15',
      localizacao: 'Praça Central',
      imagemUrl: 'https://unsplash.com'
    }
  ]);

  const [modalAberta, setModalAberta] = useState(false);
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const handleSalvarEvento = (e) => {
    e.preventDefault();
    const novoEvento = {
      id: Date.now(),
      nome,
      data,
      localizacao,
      imagemUrl: imagemUrl || 'https://unsplash.com'
    };

    setEventos([...eventos, novoEvento]);
    setModalAberta(false);
    
    // Limpa o formulário
    setNome('');
    setData('');
    setLocalizacao('');
    setImagemUrl('');
  };

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      setEventos(eventos.filter(evento => evento.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Meus Eventos Cadastrados</h1>
        <button 
          className={styles.buttonAdd} 
          onClick={() => setModalAberta(true)}
          aria-haspopup="dialog"
        >
          + Adicionar Evento
        </button>
      </header>

      {/* Grade de Eventos Responsiva */}
      <main className={styles.grid}>
        {eventos.map(evento => (
          <article key={evento.id} className={styles.card}>
            <img src={evento.imagemUrl} alt={`Capa do evento ${evento.nome}`} className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{evento.nome}</h2>
              <p className={styles.cardText}><strong>Data:</strong> {evento.data}</p>
              <p className={styles.cardText}><strong>Local:</strong> {evento.localizacao}</p>
              
              <div className={styles.cardActions}>
                <button className={styles.buttonEdit}>Editar</button>
                <button 
                  className={styles.buttonDelete} 
                  onClick={() => handleExcluir(evento.id)}
                  aria-label={`Excluir evento ${evento.nome}`}
                >
                  Excluir
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* Modal de Cadastro de Eventos (Exigido no Requisito) */}
      {modalAberta && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={styles.modalContent}>
            <h2 id="modal-title">Novo Evento</h2>
            <form onSubmit={handleSalvarEvento} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="modal-nome">Nome do Evento</label>
                <input id="modal-nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="modal-data">Data</label>
                <input id="modal-data" type="date" value={data} onChange={e => setData(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="modal-local">Localização</label>
                <input id="modal-local" type="text" value={localizacao} onChange={e => setLocalizacao(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="modal-img">URL da Imagem</label>
                <input id="modal-img" type="url" value={imagemUrl} onChange={e => setImagemUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.buttonSave}>Salvar</button>
                <button type="button" className={styles.buttonCancel} onClick={() => setModalAberta(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
