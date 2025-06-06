import React, { useState } from 'react';
import './stylesProveedor.css'; // Asegúrate de crear este archivo con los estilos de abajo

const ModalAgregarProveedor = ({ show, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [frecuenciaVisita, setFrecuenciaVisita] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoProveedor = {
      Nombre: nombre,
      Tipo_Documento: tipoDocumento,
      Numero_Documento: numeroDocumento,
      Direccion: direccion,
      Telefono: telefono,
      Email: email,
      Frecuencia_Visita: frecuenciaVisita,
    };

    try {
      await onAdd(nuevoProveedor);
      onClose();
    } catch (error) {
      setError(error.response?.data || 'Error al agregar proveedor.');
    }
  };
if (!show) return null; // 🔥 Esto lo evita completamente
return (
  <div className="proveedor-modal" style={{ display: show ? 'flex' : 'none' }}>
  <div className="proveedor-modal-content">
      <div className="proveedor-modal-header">
        <h2>Agregar Proveedor</h2>
        <span className="proveedor-close" onClick={onClose}>&times;</span>
      </div>

      {error && <p className="proveedor-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="proveedor-form-group">
          <label htmlFor="provider-name">Nombre</label>
          <input
            type="text"
            id="provider-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="proveedor-form-group">
          <label htmlFor="provider-document-type">Tipo de documento</label>
          <select
            id="provider-document-type"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            required
          >
            <option value="">Seleccione un tipo de documento</option>
            <option value="cedula">Cédula</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="ruc">RUC</option>
          </select>
        </div>

        <div className="proveedor-form-group">
          <label htmlFor="provider-document-number">Número de documento</label>
          <input
            type="text"
            id="provider-document-number"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            required
          />
        </div>

        <div className="proveedor-form-group">
          <label htmlFor="provider-address">Dirección</label>
          <input
            type="text"
            id="provider-address"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="proveedor-form-group">
          <label htmlFor="provider-phone">Teléfono</label>
          <input
            type="tel"
            id="provider-phone"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>

        <div className="proveedor-form-group">
          <label htmlFor="provider-email">Email</label>
          <input
            type="email"
            id="provider-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="proveedor-form-group">
          <label htmlFor="provider-visit-frequency">Frecuencia de visita</label>
          <input
            type="text"
            id="provider-visit-frequency"
            value={frecuenciaVisita}
            onChange={(e) => setFrecuenciaVisita(e.target.value)}
          />
        </div>

        <div className="proveedor-form-buttons">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
);


};

export default ModalAgregarProveedor;
