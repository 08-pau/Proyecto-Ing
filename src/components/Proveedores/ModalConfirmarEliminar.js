import React from 'react';

const ModalConfirmarEliminarProveedor = ({ show, onClose, onDelete }) => {
  if (!show) return null;

  return (
    <div className="proveedor-modal" style={{ display: show ? 'flex' : 'none' }}>
      <div className="proveedor-modal-content">
        <div className="proveedor-modal-header">
          <h2>Eliminar Proveedor</h2>
          <span className="proveedor-close" onClick={onClose}>×</span>
        </div>

        <div className="proveedor-form-group">
          <p>¿Estás seguro de que deseas eliminar este proveedor?</p>
        </div>

        <div className="proveedor-form-buttons">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="button" className="proveedor-btn-eliminar" onClick={onDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarEliminarProveedor;


