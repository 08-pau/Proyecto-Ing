import React, { useState, useEffect } from 'react';

const ModalEditarRol = ({ show, onClose, onEdit, rol }) => {
  const [nombreRol, setNombreRol] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (rol) {
      setNombreRol(rol.nombreRol);
      setDescripcion(rol.descripcion);
    }
  }, [rol]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rol || !rol.id) {
      console.error('ID de rol no está definido');
      return;
    }

    const updatedRol = {
      id: rol.id,  // Asegúrate de incluir el ID
      nombreRol,
      descripcion,
    };

    onEdit(updatedRol);  // Pasar el rol actualizado
    onClose(); // Cerrar el modal después de la edición
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Rol</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rol-name">Nombre del Rol</label>
            <input
              type="text"
              id="rol-name"
              value={nombreRol}
              onChange={(e) => setNombreRol(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rol-description">Descripción</label>
            <textarea
              id="rol-description"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarRol;
