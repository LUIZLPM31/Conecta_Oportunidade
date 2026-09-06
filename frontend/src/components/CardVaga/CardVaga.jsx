import Badge from '../Badge/Badge'

const MODALIDADE_ICON = {
  PRESENCIAL: 'bi-building',
  REMOTO: 'bi-laptop',
  HIBRIDO: 'bi-diagram-2',
}

export default function CardVaga({ vaga, onCandidatar, mostrarBotao = true }) {
  return (
    <div className="card h-100 fade-in">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 fw-semibold">{vaga.tituloVaga}</h5>
          <Badge tipo="modalidade" valor={vaga.modalidade} />
        </div>

        <p className="text-muted small mb-1">
          <i className="bi bi-building me-1"></i>
          {vaga.nomeEmpresa}
        </p>

        {vaga.salario && (
          <p className="text-success small fw-semibold mb-2">
            <i className="bi bi-currency-dollar me-1"></i>
            R$ {Number(vaga.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        )}

        <p className="card-text text-muted small flex-grow-1">
          {vaga.descricao?.slice(0, 120)}{vaga.descricao?.length > 120 ? '...' : ''}
        </p>

        {vaga.requisitos && (
          <p className="small mt-2">
            <span className="fw-semibold">Requisitos: </span>
            <span className="text-muted">{vaga.requisitos.slice(0, 80)}...</span>
          </p>
        )}

        {mostrarBotao && (
          <button
            className="btn btn-primary btn-sm mt-3 w-100"
            onClick={() => onCandidatar && onCandidatar(vaga.id)}
          >
            <i className="bi bi-send me-1"></i>Candidatar-se
          </button>
        )}
      </div>
    </div>
  )
}
