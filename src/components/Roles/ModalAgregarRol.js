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
if (!show) return null; 
 return (
  <div className="roles-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="roles-modal-content">
      <div className="roles-modal-header">
        <h2>Agregar Rol</h2>
        <span className="roles-close" onClick={onClose}>&times;</span>
      </div>

      {error && <p className="roles-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="roles-form-group">
          <label htmlFor="rol">Rol</label>
          <input
            type="text"
            id="rol"
            value={nombreRol}
            onChange={(e) => setRol(e.target.value)}
            required
          />
        </div>
        <div className="roles-form-group">
          <label htmlFor="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="roles-form-buttons">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
);

};

export default ModalAgregarRol;
