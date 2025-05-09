const ModalConfirmarEliminar = ({ show, onClose, onDelete, rol }) => {
    return (
      <div className="modal" style={{ display: show ? 'block' : 'none' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Confirmar Eliminación</h2>
            <span className="close" onClick={onClose}>&times;</span>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que quieres eliminar el rol "{rol ? rol.nombreRol : ''}"?</p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose}>Cancelar</button>
            <button onClick={() => onDelete(rol.id)}>Eliminar</button> {/* Ejecuta la eliminación */}
          </div>
        </div>
      </div>
    );
  };
  
  export default ModalConfirmarEliminar;
  