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
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Método de Pago</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        {error && <p className="error">{error}</p>} {/* Mostrar mensaje de error */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarMetodoPago;
