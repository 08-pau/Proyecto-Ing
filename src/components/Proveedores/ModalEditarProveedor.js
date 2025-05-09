import React, { useState, useEffect } from 'react';

const ModalEditarProveedor = ({ show, onClose, onEdit, proveedor }) => {
  const [nombre, setNombre] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [frecuenciaVisita, setFrecuenciaVisita] = useState('');

  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.Nombre);
      setTipoDocumento(proveedor.Tipo_Documento);
      setNumeroDocumento(proveedor.Numero_Documento);
      setDireccion(proveedor.Direccion);
      setTelefono(proveedor.Telefono);
      setEmail(proveedor.Email);
      setFrecuenciaVisita(proveedor.Frecuencia_Visita);
    }
  }, [proveedor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proveedor.ID_Proveedor) {
      console.error('ID_Proveedor no está definido');
      return;
    }

    const actualizadoProveedor = {
      ID_Proveedor: proveedor.ID_Proveedor,
      Nombre: nombre,
      Tipo_Documento: tipoDocumento,
      Numero_Documento: numeroDocumento,
      Direccion: direccion,
      Telefono: telefono,
      Email: email,
      Frecuencia_Visita: frecuenciaVisita,
    };

    console.log(actualizadoProveedor); // Verificar datos antes de enviar
    onEdit(actualizadoProveedor);
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Proveedor</h2>
          <span className="close" onClick={onClose}>×</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre-del-proveedor">Nombre</label>
            <input 
              type="text" 
              id="nombre-del-proveedor" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="provider-document-type">Tipo de documento</label>
            <input 
              type="text" 
              id="provider-document-type" 
              value={tipoDocumento} 
              disabled // Bloqueado para edición
            />
          </div>
          <div className="form-group">
            <label htmlFor="provider-document-number">Número de documento</label>
            <input 
              type="text" 
              id="provider-document-number" 
              value={numeroDocumento} 
              disabled // Bloqueado para edición
            />
          </div>
          <div className="form-group">
            <label htmlFor="provider-address">Dirección</label>
            <input 
              type="text" 
              id="provider-address" 
              value={direccion} 
              onChange={(e) => setDireccion(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="provider-phone">Teléfono</label>
            <input 
              type="text" 
              id="provider-phone" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="provider-email">Correo electrónico</label>
            <input 
              type="email" 
              id="provider-email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="provider-frecuencia">Frecuencia de visita</label>
            <input 
              type="text" 
              id="provider-frecuencia" 
              value={frecuenciaVisita} 
              onChange={(e) => setFrecuenciaVisita(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarProveedor;

