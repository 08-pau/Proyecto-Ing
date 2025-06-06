import React from 'react';
import './stylesCategorias.css'; 

const ModalConfirmarEliminarCategoria = ({ show, onClose, onDelete }) => {
  if (!show) return null; 
 return (
  <div className="categoria-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="categoria-modal-content">
      <div className="categoria-modal-header">
        <h2>Eliminar Categoría</h2>
        <span className="categoria-close" onClick={onClose}>×</span>
      </div>

      <div className="categoria-form-group">
        <p>¿Estás seguro de que deseas eliminar esta categoría y sus niveles asociados?</p>
      </div>

      <div className="categoria-form-buttons">
        <button type="button" onClick={onClose}>Cancelar</button>
        <button type="button" className="categoria-btn-eliminar" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

};

export default ModalConfirmarEliminarCategoria;

