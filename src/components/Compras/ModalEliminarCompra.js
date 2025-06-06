// src/components/Compras/ModalEliminarCompra.js
import React from 'react';

const ModalEliminarCompra = ({ show, onClose, onDelete }) => {
  if (!show) return null; 
return (
  <div className="compra-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="compra-modal-content">
      <div className="compra-modal-header">
        <h2>Eliminar Compra</h2>
        <span className="compra-close" onClick={onClose}>×</span>
      </div>

      <div className="compra-form-group">
        <p>¿Estás seguro de que deseas eliminar esta compra?</p>
      </div>

      <div className="compra-form-buttons">
        <button type="button" onClick={onClose}>Cancelar</button>
        <button
          type="button"
          className="compra-btn-eliminar"
          onClick={onDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

};

export default ModalEliminarCompra;

