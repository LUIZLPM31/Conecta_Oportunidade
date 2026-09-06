export default function ModalConfirmacao({ id = 'modalConfirm', mensagem, onConfirmar, titulo = 'Confirmar exclusão' }) {
  return (
    <div className="modal fade" id={id} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold text-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>{titulo}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{mensagem || 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'}</p>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              data-bs-dismiss="modal"
              onClick={onConfirmar}
            >
              <i className="bi bi-trash me-1"></i>Sim, excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
