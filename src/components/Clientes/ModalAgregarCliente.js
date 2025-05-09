import React, { useState } from 'react';

const ModalAgregarCliente = ({ show, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoCliente = { 
        Nombre: nombre, 
        Tipo_Documento: tipoDocumento, 
        Numero_Documento: numeroDocumento, 
        Direccion: direccion, 
        Telefono: telefono, 
        Email: email 
    };
  
    try {
      await onAdd(nuevoCliente); 
      onClose(); 
    } catch (error) {
      setError(error.response?.data || 'Error al agregar cliente.'); 
    }
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Cliente</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="client-name">Nombre</label>
            <input
              type="text"
              id="client-name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="client-document-type">Tipo de documento</label>
            <select
              id="client-document-type"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              required
            >
              <option value="">Seleccione un tipo de documento</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="NIT">NIT</option>
              <option value="PAS">Pasaporte</option>
              <option value="TI">Tarjeta de Identidad</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="client-document-number">Número de documento</label>
            <input
              type="text"
              id="client-document-number"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="client-address">Dirección</label>
            <input
              type="text"
              id="client-address"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="client-phone">Teléfono</label>
            <input
              type="tel"
              id="client-phone"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="client-email">Email</label>
            <input
              type="email"
              id="client-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default ModalAgregarCliente;
