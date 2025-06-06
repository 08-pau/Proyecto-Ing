import React from 'react';
import './stylesVentas.css'; // Asegúrate de tener un archivo CSS para los estilos

const ModalConfirmarEliminar = ({ show, onClose, onDelete }) => {
return(
<div className="venta-confirmar-modal" style={{ display: show ? 'flex' : 'none' }}>
  <div className="venta-confirmar-content">
    <div className="venta-confirmar-header">
      <h2>Confirmar Eliminación</h2>
      <span className="venta-confirmar-close" onClick={onClose}>&times;</span>
    </div>
    <div className="venta-confirmar-body">
      <p>¿Estás seguro de que quieres eliminar esta venta y todos sus detalles?</p>
    </div>
    <div className="venta-confirmar-footer">
      <button className="venta-confirmar-btn-cancelar" onClick={onClose}>Cancelar</button>
      <button className="venta-confirmar-btn-eliminar" onClick={onDelete}>Eliminar</button>
    </div>
  </div>
</div>
);
};

export default ModalConfirmarEliminar;
