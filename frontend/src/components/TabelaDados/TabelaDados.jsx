export default function TabelaDados({ colunas, dados, acoes }) {
  if (!dados || dados.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
        Nenhum registro encontrado.
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            {colunas.map((col) => (
              <th key={col.key} className="fw-semibold text-muted small text-uppercase">
                {col.label}
              </th>
            ))}
            {acoes && <th className="text-center">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {dados.map((row, i) => (
            <tr key={i}>
              {colunas.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {acoes && (
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    {acoes(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
