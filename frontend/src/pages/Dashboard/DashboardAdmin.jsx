import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  usuarioService, vagaService, capacitacaoService, candidaturaService
} from '../../services/services'
import Badge from '../../components/Badge/Badge'
import TabelaDados from '../../components/TabelaDados/TabelaDados'
import ModalConfirmacao from '../../components/ModalConfirmacao/ModalConfirmacao'

const CURSO_VAZIO = {
  tituloCurso: '', descricao: '', cargaHoraria: '', linkAcesso: '', instituicaoParceira: '', gratuito: true
}

export default function DashboardAdmin() {
  const [aba, setAba]           = useState('usuarios')
  const [usuarios, setUsuarios] = useState([])
  const [vagas, setVagas]       = useState([])
  const [cursos, setCursos]     = useState([])
  const [candidaturas, setCandidaturas] = useState([])
  const [deleteInfo, setDelete] = useState({ id: null, tipo: null })
  const [formC, setFormC]       = useState(CURSO_VAZIO)
  const [editCursoId, setEditCI] = useState(null)
  const [loading, setLoading]   = useState(true)

  const carregar = () => {
    Promise.all([
      usuarioService.listar(),
      vagaService.listarTodas(),
      capacitacaoService.listar(),
      candidaturaService.todas(),
    ]).then(([u, v, c, cand]) => {
      setUsuarios(u.data)
      setVagas(v.data)
      setCursos(c.data)
      setCandidaturas(cand.data)
    }).catch(() => toast.error('Erro ao carregar dados.'))
    .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  // --- Usuários ---
  const handleDeleteUsuario = async () => {
    try {
      await usuarioService.deletar(deleteInfo.id)
      toast.info('Usuário removido.')
      carregar()
    } catch { toast.error('Erro ao remover usuário.') }
  }

  // --- Vagas ---
  const handleDeleteVaga = async () => {
    try {
      await vagaService.deletar(deleteInfo.id)
      toast.info('Vaga removida.')
      carregar()
    } catch { toast.error('Erro ao remover vaga.') }
  }

  // --- Cursos ---
  const handleSalvarCurso = async (e) => {
    e.preventDefault()
    try {
      if (editCursoId) {
        await capacitacaoService.atualizar(editCursoId, formC)
        toast.success('Curso atualizado!')
      } else {
        await capacitacaoService.criar(formC)
        toast.success('Curso criado!')
      }
      setFormC(CURSO_VAZIO)
      setEditCI(null)
      carregar()
    } catch { toast.error('Erro ao salvar curso.') }
  }

  const handleEditarCurso = (c) => {
    setFormC({
      tituloCurso: c.tituloCurso,
      descricao: c.descricao || '',
      cargaHoraria: c.cargaHoraria || '',
      linkAcesso: c.linkAcesso || '',
      instituicaoParceira: c.instituicaoParceira || '',
      gratuito: c.gratuito,
    })
    setEditCI(c.id)
  }

  const handleDeleteCurso = async () => {
    try {
      await capacitacaoService.deletar(deleteInfo.id)
      toast.info('Curso removido.')
      carregar()
    } catch { toast.error('Erro ao remover curso.') }
  }

  const handleAtualizarStatusCandidatura = async (id, status) => {
    try {
      await candidaturaService.atualizarStatus(id, status)
      toast.success('Status atualizado!')
      carregar()
    } catch { toast.error('Erro ao atualizar status.') }
  }

  const handleDelete = () => {
    if (deleteInfo.tipo === 'usuario') handleDeleteUsuario()
    else if (deleteInfo.tipo === 'vaga') handleDeleteVaga()
    else if (deleteInfo.tipo === 'curso') handleDeleteCurso()
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <span className="fs-2">⚙️</span>
        <div>
          <h2 className="fw-bold mb-0">Painel Administrativo</h2>
          <p className="text-muted mb-0">Gestão completa da plataforma</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="row g-3 mb-4">
        {[
          { id: 'usuarios', label: 'Usuários', val: usuarios.length, icon: 'bi-people', cor: 'text-primary' },
          { id: 'vagas', label: 'Vagas', val: vagas.length, icon: 'bi-briefcase', cor: 'text-success' },
          { id: 'cursos', label: 'Cursos', val: cursos.length, icon: 'bi-mortarboard', cor: 'text-warning' },
          { id: 'candidaturas', label: 'Candidaturas', val: candidaturas.length, icon: 'bi-file-earmark-text', cor: 'text-info' },
        ].map((s) => (
          <div key={s.id} className="col-sm-6 col-xl-3" style={{ cursor: 'pointer' }} onClick={() => setAba(s.id)}>
            <div className={`card p-3 d-flex flex-row align-items-center gap-3 ${aba === s.id ? 'border-primary' : ''}`}>
              <i className={`bi ${s.icon} fs-2 ${s.cor}`}></i>
              <div>
                <div className="fw-bold fs-4">{s.val}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Abas */}
      <ul className="nav nav-tabs mb-4">
        {['usuarios', 'vagas', 'cursos', 'candidaturas'].map((a) => (
          <li key={a} className="nav-item">
            <button
              className={`nav-link text-capitalize ${aba === a ? 'active fw-semibold' : ''}`}
              onClick={() => setAba(a)}
            >
              {a === 'usuarios' ? '👥 Usuários' : a === 'vagas' ? '💼 Vagas' : a === 'cursos' ? '📚 Cursos' : '📄 Candidaturas'}
            </button>
          </li>
        ))}
      </ul>

      {/* Usuários */}
      {aba === 'usuarios' && (
        <TabelaDados
          colunas={[
            { key: 'nome', label: 'Nome' },
            { key: 'email', label: 'E-mail' },
            { key: 'tipoUsuario', label: 'Tipo', render: (v) => <Badge tipo="cand" valor={v} /> },
            { key: 'cidade', label: 'Cidade' },
            { key: 'criadoEm', label: 'Cadastrado', render: (v) => v?.slice(0, 10) },
          ]}
          dados={usuarios}
          acoes={(row) => (
            <button
              className="btn btn-outline-danger btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#modalDelete"
              onClick={() => setDelete({ id: row.id, tipo: 'usuario' })}
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        />
      )}

      {/* Vagas */}
      {aba === 'vagas' && (
        <TabelaDados
          colunas={[
            { key: 'tituloVaga', label: 'Título' },
            { key: 'nomeEmpresa', label: 'Empresa' },
            { key: 'modalidade', label: 'Modalidade', render: (v) => <Badge tipo="modalidade" valor={v} /> },
            { key: 'status', label: 'Status', render: (v) => <Badge tipo="status" valor={v} /> },
            { key: 'criadoEm', label: 'Criada em', render: (v) => v?.slice(0, 10) },
          ]}
          dados={vagas}
          acoes={(row) => (
            <button
              className="btn btn-outline-danger btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#modalDelete"
              onClick={() => setDelete({ id: row.id, tipo: 'vaga' })}
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        />
      )}

      {/* Cursos */}
      {aba === 'cursos' && (
        <>
          {/* Formulário de curso */}
          <div className="card p-4 mb-4">
            <h6 className="fw-bold mb-3">{editCursoId ? '✏️ Editar curso' : '➕ Novo curso'}</h6>
            <form onSubmit={handleSalvarCurso}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Título do curso *"
                    value={formC.tituloCurso}
                    onChange={(e) => setFormC({ ...formC, tituloCurso: e.target.value })}
                    required />
                </div>
                <div className="col-md-3">
                  <input type="text" className="form-control" placeholder="Instituição"
                    value={formC.instituicaoParceira}
                    onChange={(e) => setFormC({ ...formC, instituicaoParceira: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <input type="number" className="form-control" placeholder="Horas"
                    value={formC.cargaHoraria}
                    onChange={(e) => setFormC({ ...formC, cargaHoraria: e.target.value })} />
                </div>
                <div className="col-md-1 d-flex align-items-center">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="gratuito"
                      checked={formC.gratuito}
                      onChange={(e) => setFormC({ ...formC, gratuito: e.target.checked })} />
                    <label className="form-check-label small" htmlFor="gratuito">Grátis</label>
                  </div>
                </div>
                <div className="col-md-8">
                  <input type="url" className="form-control" placeholder="Link de acesso"
                    value={formC.linkAcesso}
                    onChange={(e) => setFormC({ ...formC, linkAcesso: e.target.value })} />
                </div>
                <div className="col-md-4 d-flex gap-2">
                  {editCursoId && (
                    <button type="button" className="btn btn-secondary btn-sm"
                      onClick={() => { setFormC(CURSO_VAZIO); setEditCI(null) }}>
                      Cancelar
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary btn-sm">
                    {editCursoId ? 'Salvar' : '+ Adicionar'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <TabelaDados
            colunas={[
              { key: 'tituloCurso', label: 'Curso' },
              { key: 'instituicaoParceira', label: 'Instituição' },
              { key: 'cargaHoraria', label: 'Horas', render: (v) => v ? `${v}h` : '-' },
              { key: 'gratuito', label: 'Tipo', render: (v) => (
                <span className={`badge ${v ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {v ? 'Gratuito' : 'Pago'}
                </span>
              )},
            ]}
            dados={cursos}
            acoes={(row) => (
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEditarCurso(row)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDelete"
                  onClick={() => setDelete({ id: row.id, tipo: 'curso' })}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            )}
          />
        </>
      )}

      {/* Candidaturas */}
      {aba === 'candidaturas' && (
        <TabelaDados
          colunas={[
            { key: 'nomeCandidato', label: 'Candidato' },
            { key: 'tituloVaga', label: 'Vaga' },
            { key: 'dataCandidatura', label: 'Data', render: (v) => v?.slice(0, 10) },
            { key: 'status', label: 'Status', render: (v) => <Badge tipo="statusCand" valor={v} /> },
          ]}
          dados={candidaturas}
          acoes={(row) => (
            row.status === 'PENDENTE' ? (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-success btn-sm"
                  title="Aprovar"
                  onClick={() => handleAtualizarStatusCandidatura(row.id, 'APROVADO')}
                >
                  <i className="bi bi-check-lg"></i>
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  title="Rejeitar"
                  onClick={() => handleAtualizarStatusCandidatura(row.id, 'REJEITADO')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            ) : null
          )}
        />
      )}

      <ModalConfirmacao id="modalDelete" onConfirmar={handleDelete} />
    </div>
  )
}
