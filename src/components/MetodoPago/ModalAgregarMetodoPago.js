import React, { useState } from 'react';

const ModalAgregarMetodoPago = ({ show, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoMetodoPago = { nombre, activo };

    try {
      await onAdd(nuevoMetodoPago);
      onClose();
    } catch (error) {
      setError('Error al agregar método de pago.'); // Maneja el error de la respuesta
    }
  };

  return (
  <div className="metodos-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="metodos-modal-content">
      <div className="metodos-modal-header">
        <h2>Agregar Método de Pago</h2>
        <span className="metodos-close" onClick={onClose}>&times;</span>
      </div>

      {error && <p className="metodos-error">{error}</p>} {/* Mostrar mensaje de error */}

      <form onSubmit={handleSubmit}>
        <div className="metodos-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="metodos-form-buttons">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
);

};

export default ModalAgregarMetodoPago;
