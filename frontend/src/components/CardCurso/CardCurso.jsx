export default function CardCurso({ curso }) {
  return (
    <div className="card h-100 fade-in">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="fs-3">📚</span>
          <h5 className="card-title mb-0 fw-semibold">{curso.tituloCurso}</h5>
        </div>

        <p className="text-muted small mb-1">
          <i className="bi bi-building me-1"></i>
          {curso.instituicaoParceira || 'Parceiro não informado'}
        </p>

        <p className="small mb-2">
          <i className="bi bi-clock me-1 text-primary"></i>
          {curso.cargaHoraria ? `${curso.cargaHoraria}h` : 'Duração variável'}
          {' '}
          <span className={`ms-2 badge ${curso.gratuito ? 'bg-success' : 'bg-warning text-dark'}`}>
            {curso.gratuito ? 'Gratuito' : 'Pago'}
          </span>
        </p>

        <p className="card-text text-muted small flex-grow-1">
          {curso.descricao?.slice(0, 120)}{curso.descricao?.length > 120 ? '...' : ''}
        </p>

        {curso.linkAcesso && (
          <a
            href={curso.linkAcesso}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm mt-3 w-100"
          >
            <i className="bi bi-box-arrow-up-right me-1"></i>Acessar curso
          </a>
        )}
      </div>
    </div>
  )
}
