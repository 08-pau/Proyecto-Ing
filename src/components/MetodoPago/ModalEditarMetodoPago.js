import React, { useState, useEffect } from 'react';

const ModalEditarMetodoPago = ({ show, onClose, onEdit, metodoPago }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (metodoPago && metodoPago.Nombre) {
      setNombre(metodoPago.Nombre);
    }
  }, [metodoPago]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!metodoPago || !metodoPago.ID_Metodo_Pago) {
      console.error('ID de método de pago no está definido');
      return;
    }

    const updatedMetodoPago = {
      id: metodoPago.ID_Metodo_Pago,
      nombre: nombre,  // Asegura el uso de `nombre` para el backend
    };

    onEdit(updatedMetodoPago);
    onClose();
  };

return (
  <div className="metodos-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="metodos-modal-content">
      <div className="metodos-modal-header">
        <h2>Editar Método de Pago</h2>
        <span className="metodos-close" onClick={onClose}>&times;</span>
      </div>

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
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
);

};

export default ModalEditarMetodoPago;
