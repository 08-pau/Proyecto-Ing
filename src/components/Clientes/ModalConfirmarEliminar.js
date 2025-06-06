
const ModalConfirmarEliminar = ({ show, onClose, onDelete }) => {
 if (!show) return null; 
  return (
  <div className="cliente-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="cliente-modal-content">
      <div className="cliente-modal-header">
        <h2>Eliminar Cliente</h2>
        <span className="cliente-close" onClick={onClose}>×</span>
      </div>

      <div className="cliente-form-group">
        <p>¿Estás seguro de que deseas eliminar este cliente?</p>
      </div>

      <div className="cliente-form-buttons">
        <button type="button" onClick={onClose}>Cancelar</button>
        <button type="button" className="cliente-btn-eliminar" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

};

export default ModalConfirmarEliminar;

