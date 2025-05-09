import React, { useState } from 'react';

const ModalAgregarRol = ({ show, onClose, onAdd }) => {
  const [nombreRol, setRol] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoRol = { nombreRol, descripcion };

    try {
      await onAdd(nuevoRol);
      onClose();
    } catch (error) {
      setError('Error al agregar rol.'); // Maneja el error de la respuesta
    }
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Rol</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        {error && <p className="error">{error}</p>} {/* Mostrar mensaje de error */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <input
              type="text"
              id="rol"
              value={nombreRol}
              onChange={(e) => setRol(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <input
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
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

export default ModalAgregarRol;
