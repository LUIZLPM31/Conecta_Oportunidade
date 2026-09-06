import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { candidaturaService, vagaService, capacitacaoService } from '../../services/services'
import Badge from '../../components/Badge/Badge'
import { useAuth } from '../../context/AuthContext'

export default function DashboardCandidato() {
  const [candidaturas, setCandidaturas] = useState([])
  const [vagas, setVagas]               = useState([])
  const [cursos, setCursos]             = useState([])
  const [aba, setAba]                   = useState('candidaturas')
  const [loading, setLoading]           = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    Promise.all([
      candidaturaService.minhas(),
      vagaService.listarAtivas(),
      capacitacaoService.listar(),
    ]).then(([c, v, cu]) => {
      setCandidaturas(c.data)
      setVagas(v.data)
      setCursos(cu.data)
    }).catch(() => toast.error('Erro ao carregar dados.'))
    .finally(() => setLoading(false))
  }, [])

  const handleCandidatar = async (vagaId) => {
    try {
      await candidaturaService.candidatar(vagaId)
      toast.success('Candidatura enviada! 🎉')
      const { data } = await candidaturaService.minhas()
      setCandidaturas(data)
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Erro ao candidatar.')
    }
  }

  const handleRetirar = async (id) => {
    try {
      await candidaturaService.deletar(id)
      toast.info('Candidatura retirada.')
      setCandidaturas((prev) => prev.filter((c) => c.id !== id))
    } catch {
      toast.error('Erro ao retirar candidatura.')
    }
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <span className="fs-2">👤</span>
        <div>
          <h2 className="fw-bold mb-0">Olá, {user?.nome?.split(' ')[0]}!</h2>
          <p className="text-muted mb-0">Painel do Candidato</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="row g-3 mb-4">
        {[
          { key: 'candidaturas', label: 'Candidaturas', val: candidaturas.length, icon: 'bi-send', cor: 'text-primary' },
          { key: 'vagas', label: 'Vagas disponíveis', val: vagas.length, icon: 'bi-briefcase', cor: 'text-success' },
          { key: 'cursos', label: 'Cursos', val: cursos.length, icon: 'bi-mortarboard', cor: 'text-warning' },
        ].map((s) => (
          <div key={s.label} className="col-md-4">
            <div 
              className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm"
              onClick={() => setAba(s.key)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
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
        {[
          { key: 'candidaturas', label: '📋 Minhas Candidaturas' },
          { key: 'vagas',        label: '💼 Explorar Vagas' },
          { key: 'cursos',       label: '📚 Cursos' },
        ].map((a) => (
          <li key={a.key} className="nav-item">
            <button
              className={`nav-link ${aba === a.key ? 'active fw-semibold' : ''}`}
              onClick={() => setAba(a.key)}
            >{a.label}</button>
          </li>
        ))}
      </ul>

      {/* Conteúdo */}
      {aba === 'candidaturas' && (
        <div className="table-responsive">
          {candidaturas.length === 0 ? (
            <p className="text-muted text-center py-4">Você ainda não se candidatou a nenhuma vaga.</p>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Vaga</th><th>Status</th><th>Data</th><th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {candidaturas.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-semibold">{c.tituloVaga}</td>
                    <td><Badge tipo="cand" valor={c.status} /></td>
                    <td className="text-muted small">{c.dataCandidatura?.slice(0, 10)}</td>
                    <td>
                      {c.status === 'PENDENTE' && (
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleRetirar(c.id)}>
                          Retirar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {aba === 'vagas' && (
        <div className="row g-4">
          {vagas.map((v) => (
            <div key={v.id} className="col-md-6 col-lg-4">
              <div className="card h-100 p-3">
                <h6 className="fw-bold">{v.tituloVaga}</h6>
                <p className="small text-muted mb-1">{v.nomeEmpresa}</p>
                <Badge tipo="modalidade" valor={v.modalidade} />
                {v.salario && (
                  <p className="small text-success mt-2 mb-0">
                    R$ {Number(v.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                )}
                <button
                  className="btn btn-primary btn-sm mt-3"
                  onClick={() => handleCandidatar(v.id)}
                  disabled={candidaturas.some((c) => c.vagaId === v.id)}
                >
                  {candidaturas.some((c) => c.vagaId === v.id) ? '✅ Candidatado' : 'Candidatar-se'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aba === 'cursos' && (
        <div className="row g-4">
          {cursos.map((c) => (
            <div key={c.id} className="col-md-6 col-lg-4">
              <div className="card h-100 p-3">
                <h6 className="fw-bold">{c.tituloCurso}</h6>
                <p className="small text-muted mb-1">{c.instituicaoParceira}</p>
                <p className="small">{c.cargaHoraria}h • {c.gratuito ? 'Gratuito' : 'Pago'}</p>
                {c.linkAcesso && (
                  <a href={c.linkAcesso} target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm mt-auto">
                    Acessar →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
