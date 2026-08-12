import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import styles from './Home.module.css';

export default function Home() {
  const { logoutService, user } = useAuth();
  const navigate = useNavigate();

  // Estados principais
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Estados para a Modal de Criar/Editar
  const [modalAberta, setModalAberta] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // Armazena ID se for edição
  
  // Campos do formulário do Evento
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  // 🔴 1. BUSCAR EVENTOS DO BANCO (Requisito 3 - GET por adminId)
  // Função pura de busca: retorna os dados sem mexer em estado (reutilizável)
  const buscarEventos = useCallback(async () => {
    if (!user?.id) return [];
    // Consome o endpoint correto que mapeamos: /api/eventos?adminId=X
    const response = await api.get(`/eventos?adminId=${user.id}`);
    return response.data;
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    let ativo = true;

    // Atualiza o estado apenas dentro dos callbacks (padrão recomendado)
    buscarEventos()
      .then((dados) => {
        if (ativo) setEventos(dados);
      })
      .catch((err) => {
        if (ativo) {
          setErro('Falha ao carregar a listagem de eventos.');
          console.error(err);
        }
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [buscarEventos, user]);

  // 🔴 2. SALVAR OU ATUALIZAR EVENTO (Requisito 4 e 5 - POST e PUT)
  const handleSalvarEvento = async (e) => {
    e.preventDefault();
    setErro('');

    // Validação manual: o form usa noValidate para o navegador não travar silenciosamente
    if (!nome.trim()) {
      setErro('Informe o nome do evento.');
      return;
    }
    if (!data) {
      setErro('Informe a data do evento.');
      return;
    }
    if (!localizacao.trim()) {
      setErro('Informe a localização do evento.');
      return;
    }
    if (!user?.id) {
      setErro('Sessão expirada. Faça login novamente.');
      return;
    }

    const payload = {
      nome: nome.trim(),
      data,
      localizacao: localizacao.trim(),
      // Capa opcional: sem URL, envia null e o card exibe um placeholder
      imagemUrl: (imagemUrl || '').trim() || null,
      adminId: Number(user.id)
    };

    try {
      if (editandoId) {
        // Requisito 5: Atualização baseada no eventoId (PUT)
        await api.put(`/eventos/${editandoId}`, {
          nome,
          data,
          localizacao,
          imagemUrl: payload.imagemUrl,
          adminId: payload.adminId
        });
      } else {
        // Requisito 4: Cadastro de Evento associado ao Admin (POST)
        await api.post('/eventos', payload);
      }

      // Recarrega a lista atualizada direto do banco de dados
      const dados = await buscarEventos();
      setEventos(dados);
      fecharModal();
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao salvar o evento. Verifique os dados.');
    }
  };

  // 🔴 3. EXCLUIR EVENTO (Requisito 6 - DELETE)
  const handleExcluir = async (id, nomeEvento) => {
    if (window.confirm(`Deseja realmente excluir o evento "${nomeEvento}"?`)) {
      try {
        await api.delete(`/eventos/${id}`);
        // Remove visualmente da lista sem precisar recarregar a página inteira
        setEventos(eventos.filter(evento => evento.id !== id));
      } catch {
        alert('Erro ao excluir o evento da base de dados.');
      }
    }
  };

  // Prepara os campos da modal para modo edição
  const abrirModalEdicao = (evento) => {
    setEditandoId(evento.id);
    setNome(evento.nome);
    setData(evento.data);
    setLocalizacao(evento.localizacao);
    setImagemUrl(evento.imagemUrl || '');
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setEditandoId(null);
    setNome('');
    setData('');
    setLocalizacao('');
    setImagemUrl('');
  };

  const handleLogout = () => {
    logoutService();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>Gerenciador de Eventos</p>
          <h1>Painel de Eventos</h1>
          <p className={styles.subtitle}>Gerenciamento de eventos associados à sua conta</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.buttonAdd} onClick={() => setModalAberta(true)} aria-haspopup="dialog">
            + Adicionar Evento
          </button>
          <button className={styles.buttonLogout} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {erro && <div className={styles.alertError} role="alert">{erro}</div>}

      {loading ? (
        <p className={styles.loadingText} aria-live="polite">Buscando eventos no servidor...</p>
      ) : eventos.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum evento cadastrado por você ainda.</p>
        </div>
      ) : (
        /* Grade de Eventos Responsiva e Acessível */
        <main className={styles.grid}>
          {eventos.map(evento => (
            <article key={evento.id} className={styles.card}>
              {evento.imagemUrl ? (
                <img src={evento.imagemUrl} alt={`Capa do evento ${evento.nome}`} className={styles.cardImage} />
              ) : (
                <div className={styles.cardImagePlaceholder} role="img" aria-label={`Evento ${evento.nome} sem imagem de capa`}>
                  <span>Sem imagem de capa</span>
                </div>
              )}
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{evento.nome}</h2>
                <p className={styles.cardText}><strong>Data:</strong> {evento.data}</p>
                <p className={styles.cardText}><strong>Local:</strong> {evento.localizacao}</p>
                
                <div className={styles.cardActions}>
                  <button className={styles.buttonEdit} onClick={() => abrirModalEdicao(evento)}>
                    Editar
                  </button>
                  <button 
                    className={styles.buttonDelete} 
                    onClick={() => handleExcluir(evento.id, evento.nome)}
                    aria-label={`Excluir evento ${evento.nome}`}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </main>
      )}

      {/* Modal Interativa para Criar ou Editar Eventos */}
      {modalAberta && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={styles.modalContent}>
            <h2 id="modal-title">{editandoId ? 'Atualizar Evento' : 'Novo Evento'}</h2>
            {erro && <div className={styles.alertError} role="alert">{erro}</div>}
            <form onSubmit={handleSalvarEvento} className={styles.form} noValidate>
              <div className={styles.inputGroup}>
                <label htmlFor="modal-nome">Nome do Evento</label>
                <input 
                  id="modal-nome" 
                  type="text" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  required 
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="modal-data">Data do Evento</label>
                <input id="modal-data" type="date" value={data} onChange={e => setData(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="modal-local">Localização</label>
                <input id="modal-local" type="text" value={localizacao} onChange={e => setLocalizacao(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="modal-img">URL da Imagem de Capa (opcional)</label>
                <input id="modal-img" type="url" value={imagemUrl} onChange={e => setImagemUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.buttonSave}>Salvar</button>
                <button type="button" className={styles.buttonCancel} onClick={fecharModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
