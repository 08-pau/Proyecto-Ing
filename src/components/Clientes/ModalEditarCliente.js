import React, { useState, useEffect } from 'react';

const ModalEditarCliente = ({ show, onClose, onEdit, cliente }) => {
  const [nombre, setNombre] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.Nombre);
      setTipoDocumento(cliente.Tipo_Documento);
      setNumeroDocumento(cliente.Numero_Documento);
      setDireccion(cliente.Direccion);
      setTelefono(cliente.Telefono);
      setEmail(cliente.Email);
    }
  }, [cliente]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cliente.ID_Cliente) {
      console.error('ID_Cliente no está definido');
      return;
    }
    const updatedCliente = { 
      ID_Cliente: cliente.ID_Cliente,  // Asegúrate de incluir el ID
      Nombre: nombre, 
      Tipo_Documento: tipoDocumento, 
      Numero_Documento: numeroDocumento, 
      Direccion: direccion, 
      Telefono: telefono, 
      Email: email 
    };
    onEdit(updatedCliente);  // Pasar el cliente actualizado
  };
  
if (!show) return null; 
 return (
  <div className="cliente-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="cliente-modal-content">
      <div className="cliente-modal-header">
        <h2>Editar Cliente</h2>
        <span className="cliente-close" onClick={onClose}>×</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="cliente-form-group">
          <label htmlFor="client-name">Nombre</label>
          <input
            type="text"
            id="client-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="cliente-form-group">
          <label htmlFor="client-document-type">Tipo de documento</label>
          <input
            type="text"
            id="client-document-type"
            value={tipoDocumento}
            disabled
          />
        </div>

        <div className="cliente-form-group">
          <label htmlFor="client-document-number">Número de documento</label>
          <input
            type="text"
            id="client-document-number"
            value={numeroDocumento}
            disabled
          />
        </div>

        <div className="cliente-form-group">
          <label htmlFor="client-address">Dirección</label>
          <input
            type="text"
            id="client-address"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="cliente-form-group">
          <label htmlFor="client-phone">Teléfono</label>
          <input
            type="text"
            id="client-phone"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>

        <div className="cliente-form-group">
          <label htmlFor="client-email">Email</label>
          <input
            type="email"
            id="client-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="cliente-form-buttons">
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
);

};

export default ModalEditarCliente;
