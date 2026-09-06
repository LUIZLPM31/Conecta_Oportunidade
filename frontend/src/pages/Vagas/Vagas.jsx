import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CardVaga from '../../components/CardVaga/CardVaga'
import { vagaService, candidaturaService } from '../../services/services'
import { useAuth } from '../../context/AuthContext'

export default function Vagas() {
  const [vagas, setVagas]     = useState([])
  const [filtro, setFiltro]   = useState({ modalidade: '', busca: '' })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    vagaService.listarAtivas()
      .then(({ data }) => setVagas(data))
      .catch(() => toast.error('Erro ao carregar vagas.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCandidatar = async (vagaId) => {
    if (!user) return toast.warn('Faça login para se candidatar.')
    if (user.tipoUsuario !== 'CANDIDATO') return toast.warn('Apenas candidatos podem se candidatar.')
    try {
      await candidaturaService.candidatar(vagaId)
      toast.success('Candidatura enviada com sucesso! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Erro ao enviar candidatura.')
    }
  }

  const vagasFiltradas = vagas.filter((v) => {
    const matchModal = !filtro.modalidade || v.modalidade === filtro.modalidade
    const matchBusca = !filtro.busca ||
      v.tituloVaga.toLowerCase().includes(filtro.busca.toLowerCase()) ||
      v.nomeEmpresa.toLowerCase().includes(filtro.busca.toLowerCase())
    return matchModal && matchBusca
  })

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold mb-1">Vagas disponíveis</h1>
          <p className="text-muted mb-0">{vagasFiltradas.length} oportunidade(s) encontrada(s)</p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar vaga ou empresa..."
            style={{ minWidth: 220 }}
            value={filtro.busca}
            onChange={(e) => setFiltro({ ...filtro, busca: e.target.value })}
          />
          <select
            className="form-select"
            style={{ minWidth: 140 }}
            value={filtro.modalidade}
            onChange={(e) => setFiltro({ ...filtro, modalidade: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="PRESENCIAL">Presencial</option>
            <option value="REMOTO">Remoto</option>
            <option value="HIBRIDO">Híbrido</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="row g-4">
          {vagasFiltradas.map((vaga) => (
            <div key={vaga.id} className="col-md-6 col-lg-4">
              <CardVaga
                vaga={vaga}
                onCandidatar={handleCandidatar}
                mostrarBotao={!!user && user.tipoUsuario === 'CANDIDATO'}
              />
            </div>
          ))}
          {vagasFiltradas.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">
              <i className="bi bi-search fs-1 d-block mb-2"></i>
              Nenhuma vaga encontrada para os filtros selecionados.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
