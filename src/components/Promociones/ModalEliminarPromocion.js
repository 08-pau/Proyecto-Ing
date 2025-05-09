import React from 'react';

const ModalEliminarPromocion = ({ promotion, onDelete, onClose }) => {
  const handleDelete = () => {
    onDelete(promotion.id);
    onClose();
  };

  return (
    <div className="promo-modal">
      <div className="promo-modal-content">
        <h2>Eliminar Promoción</h2>
        <p>¿Estás seguro de que deseas eliminar la promoción "{promotion.nombre}"?</p>
        <button onClick={handleDelete}>Eliminar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalEliminarPromocion;


