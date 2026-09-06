import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { vagaService, candidaturaService } from '../../services/services'
import Badge from '../../components/Badge/Badge'
import ModalConfirmacao from '../../components/ModalConfirmacao/ModalConfirmacao'
import { useAuth } from '../../context/AuthContext'

const VAGA_VAZIA = {
  tituloVaga: '', descricao: '', salario: '', requisitos: '', modalidade: 'PRESENCIAL'
}

// Emite um aviso sonoro sutil quando chega uma nova candidatura
const emitirSomNotificacao = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime) // Nota D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1) // Nota A5
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.35)
  } catch {
    // Ignora silenciosamente se o navegador restringir áudio automático
  }
}

export default function DashboardEmpresa() {
  const [vagas, setVagas]                       = useState([])
  const [candidatosPorVaga, setCandidatosPorVaga] = useState({}) // { [vagaId]: Candidatura[] }
  const [todasCandidaturas, setTodasCandidaturas] = useState([])
  const [aba, setAba]                           = useState('vagas')
  const [form, setForm]                         = useState(VAGA_VAZIA)
  const [editId, setEditId]                     = useState(null)
  const [deleteId, setDeleteId]                 = useState(null)
  const [vagaSel, setVagaSel]                   = useState(null)
  const [filtroStatus, setFiltroStatus]         = useState('')
  const [filtroVagaId, setFiltroVagaId]         = useState('')
  const [loading, setLoading]                   = useState(true)
  const { user } = useAuth()

  // Guarda os IDs de candidaturas já conhecidos para detectar novas entradas durante o polling
  const candidaturasConhecidasRef = useRef(new Set())
  const primeiroCarregamentoRef   = useRef(true)

  // Função principal para carregar dados das vagas e de todas as candidaturas da empresa
  const carregarDados = async (silencioso = false) => {
    try {
      const { data: vagasData } = await vagaService.minhasVagas()
      setVagas(vagasData)

      // Busca os candidatos de cada uma das vagas da empresa
      const mapCand = {}
      const resultados = await Promise.all(
        vagasData.map(async (v) => {
          try {
            const res = await candidaturaService.porVaga(v.id)
            mapCand[v.id] = res.data || []
            return res.data || []
          } catch {
            mapCand[v.id] = []
            return []
          }
        })
      )

      const todas = resultados.flat()
      setCandidatosPorVaga(mapCand)
      setTodasCandidaturas(todas)

      // Detecção de novas candidaturas em tempo real
      if (primeiroCarregamentoRef.current) {
        candidaturasConhecidasRef.current = new Set(todas.map(c => c.id))
        primeiroCarregamentoRef.current = false
      } else {
        const novas = todas.filter(c => !candidaturasConhecidasRef.current.has(c.id))
        if (novas.length > 0) {
          emitirSomNotificacao()
          novas.forEach(nova => {
            toast.info(
              `🔔 Nova candidatura! ${nova.nomeCandidato} se candidatou para a vaga "${nova.tituloVaga || 'sua vaga'}"!`,
              { autoClose: 7000, icon: '📩' }
            )
            candidaturasConhecidasRef.current.add(nova.id)
          })
        }
      }
    } catch {
      if (!silencioso) toast.error('Erro ao carregar dados do painel da empresa.')
    } finally {
      if (!silencioso) setLoading(false)
    }
  }

  // Carrega na montagem e ativa polling inteligente a cada 10 segundos
  useEffect(() => {
    carregarDados(false)
    const interval = setInterval(() => {
      carregarDados(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSalvar = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await vagaService.atualizar(editId, form)
        toast.success('Vaga atualizada!')
      } else {
        await vagaService.criar(form)
        toast.success('Vaga criada com sucesso! 🎉')
      }
      setForm(VAGA_VAZIA)
      setEditId(null)
      setAba('vagas')
      carregarDados(false)
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Erro ao salvar vaga.')
    }
  }

  const handleEditar = (vaga) => {
    setForm({
      tituloVaga: vaga.tituloVaga,
      descricao: vaga.descricao || '',
      salario: vaga.salario || '',
      requisitos: vaga.requisitos || '',
      modalidade: vaga.modalidade,
    })
    setEditId(vaga.id)
    setAba('form')
  }

  const handleDeletar = async () => {
    try {
      await vagaService.deletar(deleteId)
      toast.info('Vaga removida.')
      carregarDados(false)
    } catch {
      toast.error('Erro ao remover vaga.')
    }
  }

  const handleVerCandidatos = (vaga) => {
    setVagaSel(vaga)
    setFiltroVagaId(String(vaga.id))
    setAba('candidatos')
  }

  const handleStatusCandidatura = async (id, status) => {
    try {
      await candidaturaService.atualizarStatus(id, status)
      toast.success(`Candidatura marcada como ${status === 'APROVADO' ? 'Aprovada' : 'Rejeitada'}!`)
      carregarDados(true)
    } catch {
      toast.error('Erro ao atualizar status da candidatura.')
    }
  }

  const handleAlterarStatusVaga = async (id, status) => {
    try {
      await vagaService.alterarStatus(id, status)
      toast.info(`Vaga ${status === 'ATIVA' ? 'reaberta' : 'encerrada'}.`)
      carregarDados(false)
    } catch {
      toast.error('Erro ao alterar status da vaga.')
    }
  }

  // Cálculos de métricas e contagens
  const totalCandidaturas = todasCandidaturas.length
  const totalPendentes    = todasCandidaturas.filter(c => c.status === 'PENDENTE').length

  // Filtro da lista de candidatos exibida
  const listaCandidatosExibida = todasCandidaturas.filter(c => {
    const matchVaga = !filtroVagaId || String(c.vagaId) === String(filtroVagaId)
    const matchStatus = !filtroStatus || c.status === filtroStatus
    return matchVaga && matchStatus
  })

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Carregando painel da empresa...</p>
    </div>
  )

  return (
    <div className="container py-4">
      {/* Cabeçalho */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <span className="fs-2">🏢</span>
          <div>
            <h2 className="fw-bold mb-0 text-white">{user?.nome}</h2>
            <p className="text-muted mb-0">Painel da Empresa</p>
          </div>
        </div>

        {totalPendentes > 0 && (
          <div 
            className="badge bg-danger bg-opacity-25 border border-danger text-danger px-3 py-2 rounded-pill d-flex align-items-center gap-2 cursor-pointer shadow-sm"
            style={{ cursor: 'pointer' }}
            onClick={() => { setFiltroStatus('PENDENTE'); setFiltroVagaId(''); setVagaSel(null); setAba('candidatos') }}
            title="Clique para ver candidaturas pendentes"
          >
            <span className="spinner-grow spinner-grow-sm text-danger" role="status"></span>
            <span className="fw-semibold">🔔 {totalPendentes} nova(s) candidatura(s) pendente(s)</span>
          </div>
        )}
      </div>

      {/* Alerta de Notificação no Topo se houver pendências */}
      {totalPendentes > 0 && (
        <div className="alert alert-primary bg-slate-800 border-primary text-slate-100 d-flex align-items-center justify-content-between mb-4 shadow-sm rounded-3 p-3 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <span className="fs-3">📬</span>
            <div>
              <h6 className="fw-bold mb-0 text-white">Você tem {totalPendentes} candidatura(s) aguardando sua avaliação!</h6>
              <small className="text-muted">Candidatos aplicaram para suas vagas e esperam resposta.</small>
            </div>
          </div>
          <button
            className="btn btn-sm btn-primary fw-semibold px-3 py-1.5"
            onClick={() => { setFiltroStatus('PENDENTE'); setFiltroVagaId(''); setVagaSel(null); setAba('candidatos') }}
          >
            Avaliar Agora
          </button>
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Vagas cadastradas', val: vagas.length, icon: 'bi-briefcase', cor: 'text-primary' },
          { label: 'Vagas ativas', val: vagas.filter(v => v.status === 'ATIVA').length, icon: 'bi-check-circle', cor: 'text-success' },
          { label: 'Vagas encerradas', val: vagas.filter(v => v.status === 'ENCERRADA').length, icon: 'bi-x-circle', cor: 'text-danger' },
          { 
            label: 'Candidaturas recebidas', 
            val: totalCandidaturas, 
            sub: totalPendentes > 0 ? `${totalPendentes} pendente(s)` : 'Todas avaliadas',
            icon: 'bi-people', 
            cor: 'text-info' 
          },
        ].map((s) => (
          <div key={s.label} className="col-sm-6 col-md-3">
            <div className="card p-3 d-flex flex-row align-items-center gap-3 h-100 shadow-sm">
              <i className={`bi ${s.icon} fs-2 ${s.cor}`}></i>
              <div>
                <div className="fw-bold fs-4 text-white">{s.val}</div>
                <div className="text-muted small">{s.label}</div>
                {s.sub && (
                  <div className={`badge ${totalPendentes > 0 ? 'bg-danger' : 'bg-secondary'} rounded-pill mt-1`} style={{ fontSize: '0.68rem' }}>
                    {s.sub}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Abas */}
      <ul className="nav nav-tabs mb-4 border-secondary border-opacity-25">
        <li className="nav-item">
          <button
            className={`nav-link ${aba === 'vagas' ? 'active fw-semibold' : ''}`}
            onClick={() => setAba('vagas')}
          >
            💼 Minhas Vagas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${aba === 'form' ? 'active fw-semibold' : ''}`}
            onClick={() => setAba('form')}
          >
            {editId ? '✏️ Editar Vaga' : '➕ Nova Vaga'}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${aba === 'candidatos' ? 'active fw-semibold' : ''}`}
            onClick={() => { setAba('candidatos'); setVagaSel(null); setFiltroVagaId(''); }}
          >
            <span className="d-inline-flex align-items-center gap-1.5">
              <i className="fi fi-rr-user"></i> Candidatos
            </span>
            {totalPendentes > 0 ? (
              <span className="badge bg-danger rounded-pill px-2 py-0.5" style={{ fontSize: '0.75rem' }}>
                {totalPendentes} novo(s)
              </span>
            ) : totalCandidaturas > 0 ? (
              <span className="badge bg-secondary rounded-pill px-2 py-0.5" style={{ fontSize: '0.75rem' }}>
                {totalCandidaturas}
              </span>
            ) : null}
          </button>
        </li>
      </ul>

      {/* Aba 1: Lista de Vagas */}
      {aba === 'vagas' && (
        <div className="table-responsive">
          {vagas.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-briefcase fs-1 d-block mb-2"></i>
              Nenhuma vaga cadastrada ainda.
              <br />
              <button className="btn btn-primary btn-sm mt-3" onClick={() => setAba('form')}>
                + Criar primeira vaga
              </button>
            </div>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Título</th>
                  <th>Modalidade</th>
                  <th>Status</th>
                  <th>Criada em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vagas.map((v) => {
                  const candsDestaVaga = candidatosPorVaga[v.id] || []
                  const pendentesDestaVaga = candsDestaVaga.filter(c => c.status === 'PENDENTE').length

                  return (
                    <tr key={v.id}>
                      <td className="fw-semibold text-white">{v.tituloVaga}</td>
                      <td><Badge tipo="modalidade" valor={v.modalidade} /></td>
                      <td><Badge tipo="status" valor={v.status} /></td>
                      <td className="text-muted small">{v.criadoEm?.slice(0, 10)}</td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          {/* Editar */}
                          <button 
                            className="btn btn-outline-secondary btn-sm" 
                            onClick={() => handleEditar(v)}
                            title="Editar vaga"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          {/* Ver Candidatos com Badge de Notificação */}
                          <button
                            className="btn btn-outline-info btn-sm position-relative d-inline-flex align-items-center gap-1"
                            onClick={() => handleVerCandidatos(v)}
                            title={`${candsDestaVaga.length} candidato(s) inscrito(s) nesta vaga`}
                          >
                            <i className="fi fi-rr-user"></i>
                            {candsDestaVaga.length > 0 && (
                              <span className="badge bg-info text-dark rounded-pill px-1.5 py-0.5" style={{ fontSize: '0.72rem' }}>
                                {candsDestaVaga.length}
                              </span>
                            )}
                            {pendentesDestaVaga > 0 && (
                              <span 
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                                style={{ fontSize: '0.65rem' }}
                                title={`${pendentesDestaVaga} candidatura(s) pendente(s)`}
                              >
                                {pendentesDestaVaga}
                              </span>
                            )}
                          </button>

                          {/* Encerrar / Reabrir */}
                          <button
                            className={`btn btn-sm ${v.status === 'ATIVA' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            onClick={() => handleAlterarStatusVaga(v.id, v.status === 'ATIVA' ? 'ENCERRADA' : 'ATIVA')}
                          >
                            {v.status === 'ATIVA' ? 'Encerrar' : 'Reabrir'}
                          </button>

                          {/* Excluir */}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#modalDeleteVaga"
                            onClick={() => setDeleteId(v.id)}
                            title="Excluir vaga"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Aba 2: Formulário Criar/Editar */}
      {aba === 'form' && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card p-4">
              <h5 className="fw-bold mb-4 text-white">{editId ? 'Editar vaga' : 'Nova vaga'}</h5>
              <form onSubmit={handleSalvar}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Título da vaga *</label>
                    <input type="text" name="tituloVaga" className="form-control"
                      value={form.tituloVaga} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Salário (R$)</label>
                    <input type="number" name="salario" className="form-control"
                      value={form.salario} onChange={handleChange} step="0.01" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Modalidade *</label>
                    <select name="modalidade" className="form-select"
                      value={form.modalidade} onChange={handleChange}>
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="REMOTO">Remoto</option>
                      <option value="HIBRIDO">Híbrido</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Descrição</label>
                    <textarea name="descricao" className="form-control" rows={3}
                      value={form.descricao} onChange={handleChange}></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Requisitos</label>
                    <textarea name="requisitos" className="form-control" rows={2}
                      value={form.requisitos} onChange={handleChange}></textarea>
                  </div>
                  <div className="col-12 d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-secondary"
                      onClick={() => { setForm(VAGA_VAZIA); setEditId(null); setAba('vagas') }}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-save me-1"></i>{editId ? 'Salvar alterações' : 'Publicar vaga'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Aba 3: Candidatos e Notificações de Candidaturas */}
      {aba === 'candidatos' && (
        <div>
          {/* Barra de Filtros e Contexto */}
          <div className="card p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h5 className="fw-bold mb-1 text-white">
                  {vagaSel ? (
                    <>Candidatos da vaga: <span className="text-primary">{vagaSel.tituloVaga}</span></>
                  ) : (
                    <>Todas as Candidaturas Recebidas</>
                  )}
                </h5>
                <p className="text-muted small mb-0">
                  {listaCandidatosExibida.length} candidatura(s) listada(s)
                </p>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                {/* Filtro por Vaga */}
                <select
                  className="form-select form-select-sm"
                  style={{ minWidth: '200px' }}
                  value={filtroVagaId}
                  onChange={(e) => {
                    const id = e.target.value
                    setFiltroVagaId(id)
                    const v = vagas.find(item => String(item.id) === String(id))
                    setVagaSel(v || null)
                  }}
                >
                  <option value="">Todas as vagas ({totalCandidaturas})</option>
                  {vagas.map((v) => {
                    const totalVaga = (candidatosPorVaga[v.id] || []).length
                    return (
                      <option key={v.id} value={v.id}>
                        {v.tituloVaga} ({totalVaga})
                      </option>
                    )
                  })}
                </select>

                {/* Filtro por Status */}
                <select
                  className="form-select form-select-sm"
                  style={{ minWidth: '160px' }}
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                >
                  <option value="">Todos os status</option>
                  <option value="PENDENTE">⏳ Apenas Pendentes</option>
                  <option value="APROVADO">✅ Apenas Aprovados</option>
                  <option value="REJEITADO">❌ Apenas Rejeitados</option>
                </select>

                {vagaSel && (
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => { setVagaSel(null); setFiltroVagaId(''); }}
                  >
                    Ver todas
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabela de Candidatos */}
          {listaCandidatosExibida.length === 0 ? (
            <div className="card p-5 text-center text-muted">
              <i className="bi bi-people fs-1 d-block mb-3"></i>
              <h5>Nenhum candidato encontrado</h5>
              <p className="small mb-0">
                {filtroStatus || filtroVagaId
                  ? 'Tente remover os filtros selecionados acima.'
                  : 'Quando novos candidatos se inscreverem nas suas vagas, eles aparecerão aqui instantaneamente.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive card p-2">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Candidato</th>
                    <th>E-mail</th>
                    {!vagaSel && <th>Vaga</th>}
                    <th>Status</th>
                    <th>Data</th>
                    <th className="text-end">Ações de Avaliação</th>
                  </tr>
                </thead>
                <tbody>
                  {listaCandidatosExibida.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="fw-semibold text-white">{c.nomeCandidato}</div>
                      </td>
                      <td className="text-muted">{c.emailCandidato}</td>
                      {!vagaSel && (
                        <td>
                          <span className="badge bg-dark border border-secondary text-info">
                            {c.tituloVaga}
                          </span>
                        </td>
                      )}
                      <td><Badge tipo="cand" valor={c.status} /></td>
                      <td className="text-muted small">{c.dataCandidatura?.slice(0, 10)}</td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className={`btn btn-sm ${c.status === 'APROVADO' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleStatusCandidatura(c.id, 'APROVADO')}
                            title="Aprovar candidato"
                          >
                            <i className="bi bi-check-lg me-1"></i> Aprovar
                          </button>
                          <button
                            className={`btn btn-sm ${c.status === 'REJEITADO' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleStatusCandidatura(c.id, 'REJEITADO')}
                            title="Rejeitar candidato"
                          >
                            <i className="bi bi-x-lg me-1"></i> Rejeitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ModalConfirmacao
        id="modalDeleteVaga"
        mensagem="Tem certeza que deseja remover esta vaga? Todas as candidaturas serão excluídas."
        onConfirmar={handleDeletar}
      />
    </div>
  )
}
