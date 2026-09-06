import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CardCurso from '../../components/CardCurso/CardCurso'
import { capacitacaoService } from '../../services/services'

export default function Cursos() {
  const [cursos, setCursos]   = useState([])
  const [busca, setBusca]     = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    capacitacaoService.listar()
      .then(({ data }) => setCursos(data))
      .catch(() => toast.error('Erro ao carregar capacitações.'))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = cursos.filter((c) =>
    c.tituloCurso.toLowerCase().includes(busca.toLowerCase()) ||
    (c.instituicaoParceira || '').toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold mb-1">Capacitações Profissionais</h1>
          <p className="text-muted mb-0">Cursos gratuitos para impulsionar sua carreira</p>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar curso ou instituição..."
          style={{ maxWidth: 280 }}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="row g-4">
          {filtrados.map((curso) => (
            <div key={curso.id} className="col-md-6 col-lg-4">
              <CardCurso curso={curso} />
            </div>
          ))}
          {filtrados.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">
              <i className="bi bi-mortarboard fs-1 d-block mb-2"></i>
              Nenhum curso encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
