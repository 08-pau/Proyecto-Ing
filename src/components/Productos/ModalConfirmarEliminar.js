const ModalConfirmarEliminar = ({ show, onClose, onDelete }) => {
  if (!show) return null;  
return (
  <div className="producto-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="producto-modal-content">
      <div className="producto-modal-header">
        <h2>Confirmar Eliminación</h2>
        <span className="producto-close" onClick={onClose}>&times;</span>
      </div>
      <div className="producto-form-group">
        <p>¿Estás seguro de que quieres eliminar este producto?</p>
      </div>
      <div className="producto-form-buttons">
        <button type="button" onClick={onClose}>Cancelar</button>
        <button type="button" className="producto-btn-eliminar" onClick={onDelete}>Eliminar</button>
      </div>
    </div>
  </div>
);

  };
  
  export default ModalConfirmarEliminar;
  
