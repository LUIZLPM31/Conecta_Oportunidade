import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { vagaService, candidaturaService } from '../../services/services'
import Badge from '../../components/Badge/Badge'
import ModalConfirmacao from '../../components/ModalConfirmacao/ModalConfirmacao'
import { useAuth } from '../../context/AuthContext'

const VAGA_VAZIA = {
  tituloVaga: '', descricao: '', salario: '', requisitos: '', modalidade: 'PRESENCIAL'
}

export default function DashboardEmpresa() {
  const [vagas, setVagas]           = useState([])
  const [aba, setAba]               = useState('vagas')
  const [form, setForm]             = useState(VAGA_VAZIA)
  const [editId, setEditId]         = useState(null)
  const [deleteId, setDeleteId]     = useState(null)
  const [candidatos, setCandidatos] = useState([])
  const [vagaSel, setVagaSel]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const { user } = useAuth()

  const carregar = () => {
    vagaService.minhasVagas()
      .then(({ data }) => setVagas(data))
      .catch(() => toast.error('Erro ao carregar vagas.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

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
      carregar()
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
      carregar()
    } catch {
      toast.error('Erro ao remover vaga.')
    }
  }

  const handleVerCandidatos = async (vaga) => {
    setVagaSel(vaga)
    const { data } = await candidaturaService.porVaga(vaga.id)
    setCandidatos(data)
    setAba('candidatos')
  }

  const handleStatusCandidatura = async (id, status) => {
    try {
      await candidaturaService.atualizarStatus(id, status)
      toast.success('Status atualizado!')
      const { data } = await candidaturaService.porVaga(vagaSel.id)
      setCandidatos(data)
    } catch {
      toast.error('Erro ao atualizar status.')
    }
  }

  const handleAlterarStatusVaga = async (id, status) => {
    try {
      await vagaService.alterarStatus(id, status)
      toast.info(`Vaga ${status === 'ATIVA' ? 'reaberta' : 'encerrada'}.`)
      carregar()
    } catch {
      toast.error('Erro ao alterar status.')
    }
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <span className="fs-2">🏢</span>
        <div>
          <h2 className="fw-bold mb-0">{user?.nome}</h2>
          <p className="text-muted mb-0">Painel da Empresa</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Vagas cadastradas', val: vagas.length, icon: 'bi-briefcase', cor: 'text-primary' },
          { label: 'Vagas ativas', val: vagas.filter(v => v.status === 'ATIVA').length, icon: 'bi-check-circle', cor: 'text-success' },
          { label: 'Vagas encerradas', val: vagas.filter(v => v.status === 'ENCERRADA').length, icon: 'bi-x-circle', cor: 'text-danger' },
        ].map((s) => (
          <div key={s.label} className="col-md-4">
            <div className="card p-3 d-flex flex-row align-items-center gap-3">
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
          { key: 'vagas',      label: '💼 Minhas Vagas' },
          { key: 'form',       label: editId ? '✏️ Editar Vaga' : '➕ Nova Vaga' },
          { key: 'candidatos', label: '👥 Candidatos', disabled: !vagaSel },
        ].map((a) => (
          <li key={a.key} className="nav-item">
            <button
              className={`nav-link ${aba === a.key ? 'active fw-semibold' : ''}`}
              onClick={() => !a.disabled && setAba(a.key)}
              disabled={a.disabled}
            >{a.label}</button>
          </li>
        ))}
      </ul>

      {/* Lista de vagas */}
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
                <tr><th>Título</th><th>Modalidade</th><th>Status</th><th>Criada em</th><th>Ações</th></tr>
              </thead>
              <tbody>
                {vagas.map((v) => (
                  <tr key={v.id}>
                    <td className="fw-semibold">{v.tituloVaga}</td>
                    <td><Badge tipo="modalidade" valor={v.modalidade} /></td>
                    <td><Badge tipo="status" valor={v.status} /></td>
                    <td className="text-muted small">{v.criadoEm?.slice(0, 10)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEditar(v)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-outline-info btn-sm" onClick={() => handleVerCandidatos(v)}>
                          <i className="bi bi-people"></i>
                        </button>
                        <button
                          className={`btn btn-sm ${v.status === 'ATIVA' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleAlterarStatusVaga(v.id, v.status === 'ATIVA' ? 'ENCERRADA' : 'ATIVA')}
                        >
                          {v.status === 'ATIVA' ? 'Encerrar' : 'Reabrir'}
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#modalDeleteVaga"
                          onClick={() => setDeleteId(v.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Formulário */}
      {aba === 'form' && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card p-4">
              <h5 className="fw-bold mb-4">{editId ? 'Editar vaga' : 'Nova vaga'}</h5>
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

      {/* Candidatos da vaga */}
      {aba === 'candidatos' && vagaSel && (
        <div>
          <h5 className="fw-bold mb-3">Candidatos para: <span className="text-primary">{vagaSel.tituloVaga}</span></h5>
          {candidatos.length === 0 ? (
            <p className="text-muted">Nenhum candidato ainda.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr><th>Nome</th><th>E-mail</th><th>Status</th><th>Data</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {candidatos.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-semibold">{c.nomeCandidato}</td>
                      <td className="text-muted">{c.emailCandidato}</td>
                      <td><Badge tipo="cand" valor={c.status} /></td>
                      <td className="text-muted small">{c.dataCandidatura?.slice(0, 10)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-success btn-sm"
                            onClick={() => handleStatusCandidatura(c.id, 'APROVADO')}>
                            Aprovar
                          </button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleStatusCandidatura(c.id, 'REJEITADO')}>
                            Rejeitar
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

      <ModalConfirmacao
        id="modalDeleteVaga"
        mensagem="Tem certeza que deseja remover esta vaga? Todas as candidaturas serão excluídas."
        onConfirmar={handleDeletar}
      />
    </div>
  )
}
